import { Injectable } from "@angular/core";
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
} from "@ngrx/component-store";
import { Product } from "./product.model";
import { HttpErrorResponse } from "@angular/common/http";

interface productState {
  products: Product[];
  searchTerm: string | null;
  sortColumn: string | null;
  sortDirection: string | null;
  page: number;
  limit: number;
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
  loading: false,
  error: null,
};

Injectable();
export class ProductStore
  extends ComponentStore<productState>
  implements OnStoreInit, OnStateInit
{
  constructor() {
    super(initialState);
  }
  ngrxOnStateInit() {}
  ngrxOnStoreInit() {}
}
