import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ComponentStore, OnStateInit } from "@ngrx/component-store";
import { StockDisplayModel } from "./stock-display.model";

interface StockState {
  stocks: StockDisplayModel[];
  searchTerm: string | null;
  sortColumn: string | null;
  sortDirection: string | null;
  page: number;
  limit: number;
  totalRecords: number;
  loading: boolean;
  error: HttpErrorResponse | null;
}

const initialState: StockState = {
  stocks: [],
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
export class StockStore
  extends ComponentStore<StockState>
  implements OnStateInit
{
  constructor() {
    super(initialState);
  }

  ngrxOnStateInit() {
    //load stocks here
  }
}
