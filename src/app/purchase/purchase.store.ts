import { Injectable, inject } from "@angular/core";
import { PaginatedPurchase, PurchaseModel } from "./purchase.model";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from "@ngrx/component-store";
import { PurchaseService } from "./purchase.service";
import { combineLatest, exhaustMap, switchMap, tap } from "rxjs";

interface PurchaseState {
  purchases: PurchaseModel[];
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

const initialState: PurchaseState = {
  purchases: [],
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
export class PurchaseStore
  extends ComponentStore<PurchaseState>
  implements OnStateInit
{
  private readonly purchaseService = inject(PurchaseService);

  private readonly purchases$ = this.select((s) => s.purchases);
  private readonly productName$ = this.select((s) => s.productName);
  private readonly dateFrom$ = this.select((s) => s.dateFrom);
  private readonly dateTo$ = this.select((s) => s.dateTo);
  private readonly sortColumn$ = this.select((s) => s.sortColumn);
  private readonly sortDirection$ = this.select((s) => s.sortDirection);
  private readonly page$ = this.select((s) => s.page);
  private readonly limit$ = this.select((s) => s.limit);
  private readonly totalRecords$ = this.select((s) => s.totalRecords);
  private readonly loading$ = this.select((s) => s.loading);
  private readonly error$ = this.select((s) => s.error);

  readonly vm$ = this.select({
    purchases: this.purchases$,
    productName: this.productName$,
    dateFrom: this.dateFrom$,
    dateTo: this.dateTo$,
    sortColumn: this.sortColumn$,
    sortDirection: this.sortDirection$,
    page: this.page$,
    limit: this.limit$,
    totalRecords: this.totalRecords$,
    loading: this.loading$,
    error: this.error$,
  });

  private setLoading = this.updater((state) => ({
    ...state,
    loading: true,
  }));
  private setError = this.updater((state, error: HttpErrorResponse) => ({
    ...state,
    loading: false,
    error,
  }));

  private addSinglePurchaseToState = this.updater(
    (state, purchase: PurchaseModel) => ({
      ...state,
      loading: false,
      purchases: [...state.purchases, purchase],
    })
  );

  private loadPurchaseToState = this.updater(
    (state, purchases: PurchaseModel[]) => {
      const updatedState = {
        ...state,
        loading: false,
        purchases,
      };
      return updatedState;
    }
  );

  private updatePurchaseFromState = this.updater(
    (state, purchase: PurchaseModel) => ({
      ...state,
      loading: false,
      purchases: state.purchases.map((p) =>
        p.id === purchase.id ? purchase : p
      ),
    })
  );

  private deletePurchaseFromModel = this.updater((state, id: number) => {
    // console.log({ beforeDelete: state.purchases.map((a) => a.productName) });
    //console.log(id);
    const updatedRecords = state.purchases.filter((p) => p.id !== id);
    const updatedState = {
      ...state,
      loading: false,
      purchases: updatedRecords,
    };
    // console.log({
    //   afterDelete: updatedState.purchases.map((a) => a.productName),
    // });
    return updatedState;
  });

  setProductName = this.updater((state, productName: string | null) => ({
    ...state,
    productName,
  }));

  setDateFilter = this.updater(
    (
      state,
      dateParams: { dateFrom: string | null; dateTo: string | null }
    ) => ({
      ...state,
      dateFrom: dateParams.dateFrom,
      dateTo: dateParams.dateTo,
    })
  );

  setPage = this.updater((state, page: number) => ({
    ...state,
    page,
  }));

  setLimit = this.updater((state, limit: number) => ({
    ...state,
    limit,
  }));

  setTotalRecords = this.updater((state, totalRecords: number) => ({
    ...state,
    totalRecords,
  }));

  setSortColumn = this.updater((state, sortColumn: string) => ({
    ...state,
    sortColumn,
  }));

  setSortDirection = this.updater((state, sortDirection: "asc" | "desc") => ({
    ...state,
    sortDirection,
  }));

  readonly loadPurchases = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading()),
      exhaustMap(() => {
        const combinedStream$ = combineLatest([
          this.page$,
          this.limit$,
          this.productName$,
          this.dateFrom$,
          this.dateTo$,
          this.sortColumn$,
          this.sortDirection$,
        ]);
        return combinedStream$.pipe(
          switchMap(
            ([
              page,
              limit,
              productName,
              dateFrom,
              dateTo,
              sortColumn,
              sortDirection,
            ]) => {
              return this.purchaseService
                .getAll(
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
                    (response) => {
                      this.handlePurchaseResponse(response);
                    },
                    (error: HttpErrorResponse) => {
                      this.setError(error);
                    }
                  )
                );
            }
          )
        );
      })
    )
  );

  private handlePurchaseResponse = (response: PaginatedPurchase) => {
    this.setPage(response.Page);
    this.setLimit(response.Limit);
    this.setTotalRecords(response.TotalRecords);
    this.loadPurchaseToState(response.purchases);
  };

  readonly addPurchase = this.effect<PurchaseModel>((trigger$) =>
    trigger$.pipe(
      tap((_) => this.setLoading()),
      switchMap((purchase) =>
        this.purchaseService.add(purchase).pipe(
          tapResponse(
            (response) => this.addSinglePurchaseToState(response),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );
  readonly updatePurchase = this.effect<PurchaseModel>((trigger$) =>
    trigger$.pipe(
      tap((_) => this.setLoading()),
      switchMap((purchase) =>
        this.purchaseService.update(purchase).pipe(
          tapResponse(
            (response) => this.updatePurchaseFromState(response),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );

  readonly deletePurchase = this.effect<number>((id$) =>
    id$.pipe(
      tap((_) => this.setLoading()),
      switchMap((id) =>
        this.purchaseService.delete(id).pipe(
          tapResponse(
            () => this.deletePurchaseFromModel(id),
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
    this.loadPurchases();
  }
}
