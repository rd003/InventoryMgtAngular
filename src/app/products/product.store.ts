import { Injectable, inject } from "@angular/core";
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from "@ngrx/component-store";
import { PaginatedProduct, Product } from "./product.model";
import { HttpErrorResponse } from "@angular/common/http";
import { combineLatest, exhaustMap, switchMap, tap } from "rxjs";
import { ProductService } from "./product.service";

interface productState {
  products: Product[];
  searchTerm: string | null;
  sortColumn: string | null;
  sortDirection: string | null;
  page: number;
  limit: number;
  totalRecords: number;
  loading: boolean;
  error: HttpErrorResponse | null;
}

const initialState: productState = {
  products: [],
  searchTerm: null,
  sortColumn: null,
  sortDirection: null,
  page: 1,
  limit: 4,
  totalRecords: 0,
  loading: false,
  error: null,
};

@Injectable()
export class ProductStore
  extends ComponentStore<productState>
  implements OnStoreInit, OnStateInit
{
  private readonly productService = inject(ProductService);

  private readonly products$ = this.select((a) => a.products);
  private readonly loading$ = this.select((a) => a.loading);
  private readonly error$ = this.select((a) => a.error);
  private readonly page$ = this.select((a) => a.page);
  private readonly limit$ = this.select((a) => a.limit);
  private readonly totalRecords$ = this.select((a) => a.totalRecords);
  private readonly searchTerm$ = this.select((a) => a.searchTerm);
  private readonly sortColumn$ = this.select((a) => a.sortColumn);
  private readonly sortDirection$ = this.select((a) => a.sortDirection);

  readonly vm$ = this.select({
    products: this.products$,
    searchTerm: this.searchTerm$,
    sortColumn: this.sortColumn$,
    sortDirection: this.sortDirection$,
    page: this.page$,
    limit: this.limit$,
    totalRecords: this.totalRecords$,
    loading: this.loading$,
    error: this.error$,
  });

  constructor() {
    super(initialState);
  }

  private readonly addMultipleProductToStore = this.updater(
    (state, products: Product[]) => ({
      ...state,
      loading: false,
      products,
    })
  );

  private readonly addSingleProductToStore = this.updater(function updaterFn(
    state,
    product: Product
  ) {
    const updateState = {
      ...state,
      products: [...state.products, product],
    };
    return updateState;
  });

  private readonly updateStoresProduct = this.updater(
    (state, product: Product) => ({
      ...state,
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })
  );

  private readonly deleteStoresProduct = this.updater((state, id: number) => ({
    ...state,
    products: state.products.filter((p) => p.id !== id),
  }));

  private readonly setLoading = this.updater((state) => ({
    ...state,
    loading: true,
  }));

  private readonly setError = this.updater(
    (state, error: HttpErrorResponse) => ({
      ...state,
      error,
      loading: false,
    })
  );

  readonly setSearchTerm = this.updater((state, searchTerm: string | null) => ({
    ...state,
    searchTerm,
  }));

  readonly setSortColumn = this.updater((state, sortColumn: string | null) => ({
    ...state,
    sortColumn,
  }));

  readonly setSortDirection = this.updater(
    (state, sortDirection: "asc" | "desc" | null) => ({
      ...state,
      sortDirection,
    })
  );

  readonly setPage = this.updater((state, page: number) => ({
    ...state,
    page,
  }));

  readonly setPageLimit = this.updater((state, limit: number) => ({
    ...state,
    limit,
  }));

  readonly setTotalRecords = this.updater((state, totalRecords: number) => ({
    ...state,
    totalRecords,
  }));

  readonly addProduct = this.effect<Product>((product$) =>
    product$.pipe(
      tap(this.setLoading),
      switchMap((product) =>
        this.productService.addProduct(product).pipe(
          tapResponse(
            (response) => this.addSingleProductToStore(response),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );

  readonly updateProduct = this.effect<Product>((product$) =>
    product$.pipe(
      tap(this.setLoading),
      switchMap((product) =>
        this.productService.updateProduct(product).pipe(
          tapResponse(
            (response) => this.updateStoresProduct(response),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );
  readonly deleteProduct = this.effect<number>((product$) =>
    product$.pipe(
      tap(this.setLoading),
      switchMap((id) =>
        this.productService.deleteProduct(id).pipe(
          tapResponse(
            () => this.deleteStoresProduct(id),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );

  readonly loadProducts = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading()),
      exhaustMap(() => {
        const combinedStream$ = combineLatest([
          this.searchTerm$,
          this.sortColumn$,
          this.sortDirection$,
          this.page$,
          this.limit$,
        ]);
        return combinedStream$.pipe(
          switchMap(([searchTerm, sortColumn, sortDirection, page, limit]) =>
            this.productService
              .getProducts(page, limit, searchTerm, sortColumn, sortDirection)
              .pipe(
                tapResponse(
                  (response) => {
                    this.loadProductResponse(response);
                  },
                  (error: HttpErrorResponse) => this.setError(error)
                )
              )
          )
        );
        // return this.productService.getProducts().pipe(
        //   tapResponse(
        //     (response) => this.loadProductResponse(response),
        //     (error: HttpErrorResponse) => this.setError(error)
        //   )
        // );
      })
    )
  );

  ngrxOnStateInit() {
    this.loadProducts();
  }
  ngrxOnStoreInit() {}

  private loadProductResponse = (response: PaginatedProduct) => {
    // console.log({
    //   products: response.products,
    //   count: response.products.length,
    // });
    this.addMultipleProductToStore(response.products);
    this.setPage(response.Page);
    this.setPageLimit(response.Limit);
    this.setTotalRecords(response.TotalRecords);
  };
}
