import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from "@ngrx/component-store";
import { StockDisplayModel } from "./stock-display.model";
import { combineLatest, switchMap, tap } from "rxjs";
import { StockService } from "./stock.service";

interface StockState {
  stocks: StockDisplayModel[];
  searchTerm: string | null;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  page: number;
  limit: number;
  totalRecords: number;
  loading: boolean;
  error: HttpErrorResponse | null;
}

const initialState: StockState = {
  stocks: [],
  sortColumn: "Id",
  sortDirection: "asc",
  searchTerm: null,
  page: 1,
  limit: 4,
  totalRecords: 0,
  loading: false,
  error: null,
};

@Injectable()
export class StockStore
  extends ComponentStore<StockState>
  implements OnStateInit
{
  private readonly stockService = inject(StockService);

  private readonly stocks$ = this.select((a) => a.stocks);
  private readonly loading$ = this.select((a) => a.loading);
  private readonly error$ = this.select((a) => a.error);
  private readonly page$ = this.select((a) => a.page);
  private readonly limit$ = this.select((a) => a.limit);
  private readonly sortColumn$ = this.select((a) => a.sortColumn);
  private readonly sortDirection$ = this.select((a) => a.sortDirection);
  private readonly searchTerm$ = this.select((a) => a.searchTerm);
  private readonly totalRecords$ = this.select((a) => a.totalRecords);

  readonly vm$ = this.select({
    stocks: this.stocks$,
    loading: this.loading$,
    error: this.error$,
    page: this.page$,
    limit: this.limit$,
    sortColumn: this.sortColumn$,
    sortDirection: this.sortDirection$,
    searchTerm: this.searchTerm$,
    totalRecords: this.totalRecords$,
  });

  private readonly setLoading = this.updater((state) => ({
    ...state,
    loading: true,
  }));

  private readonly setError = this.updater(
    (state, error: HttpErrorResponse) => ({ ...state, error })
  );

  readonly setSearchTerm = this.updater((state, searchTerm: string | null) => ({
    ...state,
    searchTerm,
  }));

  readonly setPage = this.updater((state, page: number) => ({
    ...state,
    page,
  }));

  readonly setLimit = this.updater((state, limit: number) => ({
    ...state,
    limit,
  }));

  private readonly setTotalRecords = this.updater(
    (state, totalRecords: number) => ({
      ...state,
      totalRecords,
    })
  );
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

  readonly loadStocksToState = this.updater(
    (state, stocks: StockDisplayModel[]) => ({
      ...state,
      loading: false,
      stocks,
    })
  );

  readonly loadStocks = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading()),
      switchMap(() => {
        const combined$ = combineLatest([
          this.searchTerm$,
          this.page$,
          this.limit$,
          this.sortColumn$,
          this.sortDirection$,
        ]);
        return combined$.pipe(
          switchMap(([searchTerm, page, limit, sortColumn, sortDirection]) =>
            this.stockService
              .getStocks(page, limit, sortColumn, sortDirection, searchTerm)
              .pipe(
                tapResponse(
                  (response) => {
                    this.loadStocksToState(response.stocks);
                    this.setPage(response.Page);
                    this.setLimit(response.Limit);
                    this.setTotalRecords(response.TotalRecords);
                  },
                  (error: HttpErrorResponse) => this.setError(error)
                )
              )
          )
        );
      })
    )
  );

  constructor() {
    super(initialState);
  }

  ngrxOnStateInit() {
    this.loadStocks();
  }
}
