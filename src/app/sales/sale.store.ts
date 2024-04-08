import { Injectable, inject } from "@angular/core";
import { SaleModel } from "../category/sale.model";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from "@ngrx/component-store";
import { SaleService } from "./sale.service";
import { combineLatest, exhaustMap, switchMap, tap } from "rxjs";

interface SaleState {
  sales: SaleModel[];
  productName: string | null; // search filter
  dateFrom: string | null; // date filter
  dateTo: string | null; // date filter
  sortColumn: string;
  sortDirection: "asc" | "desc";
  page: number;
  limit: number;
  totalRecords: number;
  loading: boolean;
  error: HttpErrorResponse | null;
}

const initialState: SaleState = {
  sales: [],
  productName: null,
  dateFrom: null,
  dateTo: null,
  sortColumn: "Id",
  sortDirection: "asc",
  page: 1,
  limit: 5,
  totalRecords: 0,
  loading: false,
  error: null,
};

@Injectable()
export class SaleStore
  extends ComponentStore<SaleState>
  implements OnStateInit
{
  private readonly saleService = inject(SaleService);

  private readonly loading$ = this.select((s) => s.loading);
  private readonly error$ = this.select((s) => s.error);
  private readonly sales$ = this.select((s) => s.sales);
  private readonly productName$ = this.select((s) => s.productName);
  private readonly dateFrom$ = this.select((s) => s.dateFrom);
  private readonly dateTo$ = this.select((s) => s.dateTo);
  private readonly sortColumn$ = this.select((s) => s.sortColumn);
  private readonly sortDirection$ = this.select((s) => s.sortDirection);
  private readonly page$ = this.select((s) => s.page);
  private readonly limit$ = this.select((s) => s.limit);
  private readonly totalRecords$ = this.select((s) => s.totalRecords);

  vm$ = this.select({
    sales: this.sales$,
    loading: this.loading$,
    error: this.error$,
    sortColumn: this.sortColumn$,
    sortDirection: this.sortDirection$,
    page: this.page$,
    limit: this.limit$,
    totalRecords: this.totalRecords$,
    dateFrom: this.dateFrom$,
    dateTo: this.dateTo$,
    productName: this.productName$,
  });

  private readonly setLoading = this.updater((state) => ({
    ...state,
    loading: true,
  }));

  private readonly setError = this.updater(
    (state, error: HttpErrorResponse) => ({
      ...state,
      error,
    })
  );

  readonly setProductName = this.updater((state, productName: string) => ({
    ...state,
    productName,
  }));

  readonly setDateFilter = this.updater(
    (state, dateFilters: { dateFrom: string; dateTo: string }) => ({
      ...state,
      dateFrom: dateFilters.dateFrom,
      dateTo: dateFilters.dateTo,
    })
  );

  readonly setPage = this.updater((state, page: number) => ({
    ...state,
    page,
  }));

  readonly setLimit = this.updater((state, limit: number) => ({
    ...state,
    limit,
  }));

  readonly setTotalRecords = this.updater((state, totalRecords: number) => ({
    ...state,
    totalRecords,
  }));

  readonly setSortColumn = this.updater((state, sortColumn: string) => ({
    ...state,
    sortColumn,
  }));

  readonly setSortDirection = this.updater(
    (state, sortDirection: "asc" | "desc") => ({
      ...state,
      sortDirection,
    })
  );

  private readonly addAllSaleRecordsToStore = this.updater(
    (state, sales: SaleModel[]) => ({ ...state, sales, loading: false })
  );

  private readonly addSingleRecordToStore = this.updater(
    (state, sale: SaleModel) => ({
      ...state,
      loading: false,
      sales: [...state.sales, sale],
    })
  );

  private readonly removeRecordFromStore = this.updater(
    (state, id: number) => ({
      ...state,
      loading: false,
      sales: state.sales.filter((s) => s.id !== id),
    })
  );

  private readonly UpdateSaleRecordOfStore = this.updater(
    (state, sale: SaleModel) => ({
      ...state,
      loading: false,
      sales: state.sales.map((s) => (s.id === sale.id ? sale : s)),
    })
  );

  readonly loadSales = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((_) => this.setLoading),
      exhaustMap(() => {
        const combined$ = combineLatest([
          this.page$,
          this.limit$,
          this.sortColumn$,
          this.sortDirection$,
          this.dateFrom$,
          this.dateTo$,
          this.productName$,
        ]);
        return combined$.pipe(
          switchMap(
            ([
              page,
              limit,
              sortColumn,
              sortDirection,
              dateFrom,
              dateTo,
              productName,
            ]) =>
              this.saleService
                .getSales(
                  page,
                  limit,
                  productName,
                  dateFrom,
                  dateTo,
                  sortColumn,
                  sortDirection
                )
                .pipe(
                  tapResponse(
                    (paginatedSale) => {
                      this.addAllSaleRecordsToStore(paginatedSale.sales);
                      //   this.setPage(paginatedSale.Page),
                      //  this.setLimit(paginatedSale.Limit);
                      this.setTotalRecords(paginatedSale.TotalRecords);
                    },
                    (error: HttpErrorResponse) => this.setError(error)
                  )
                )
          )
        );
      })
    )
  );

  addSale = this.effect<SaleModel>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading()),
      switchMap((sale) =>
        this.saleService.addSale(sale).pipe(
          tapResponse(
            (response) => this.addSingleRecordToStore(response),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );

  updateSale = this.effect<SaleModel>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading()),
      switchMap((sale) =>
        this.saleService.updateSale(sale).pipe(
          tapResponse(
            (response) => this.UpdateSaleRecordOfStore(response),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );

  deleteSale = this.effect<number>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading),
      switchMap((id) =>
        this.saleService.deleteSale(id).pipe(
          tapResponse(
            () => this.removeRecordFromStore(id),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );

  constructor() {
    super(initialState);
  }
  ngrxOnStateInit() {
    this.loadSales();
  }
}
