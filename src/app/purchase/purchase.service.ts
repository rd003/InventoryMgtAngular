import { Injectable, inject } from "@angular/core";
import { PaginatedPurchase, PurchaseModel } from "./purchase.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment.development";
import { Observable, map } from "rxjs";
import { PaginationModel } from "../shared/models/pagination.model";

@Injectable({
  providedIn: "root",
})
export class PurchaseService {
  private readonly _http = inject(HttpClient);
  private baseUrl = environment.API_BASE_URL + "/purchases";

  add(purchase: PurchaseModel): Observable<PurchaseModel> {
    return this._http.post<PurchaseModel>(this.baseUrl, purchase);
  }

  update(purchase: PurchaseModel): Observable<PurchaseModel> {
    const url = `${this.baseUrl}/${purchase.id}`;
    return this._http.put<PurchaseModel>(url, purchase);
  }

  delete(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this._http.delete<any>(url);
  }

  getById(id: number): Observable<PurchaseModel> {
    const url = `${this.baseUrl}/${id}`;
    return this._http.get<PurchaseModel>(url);
  }

  getAll(
    page = 1,
    limit = 4,
    productName: string | null = null,
    dateFrom: string | null = null,
    dateTo: string | null = null,
    sortColumn = "Id",
    sortDirection: "asc" | "desc" = "asc"
  ): Observable<PaginatedPurchase> {
    let parameters = new HttpParams();
    parameters = parameters.set("page", page);
    parameters = parameters.set("limit", limit);
    parameters = parameters.set("sortColumn", sortColumn);
    parameters = parameters.set("sortDirection", sortDirection);
    if (productName) {
      parameters = parameters.set("productName", productName);
    }
    if (dateFrom && dateTo) {
      parameters = parameters.set("dateFrom", dateFrom);
      parameters = parameters.set("dateTo", dateTo);
    }
    return this._http
      .get(this.baseUrl, {
        observe: "response",
        params: parameters,
      })
      .pipe(
        map((response) => {
          const paginationJson = response.headers.get("X-Pagination") as string;
          const pagination = JSON.parse(paginationJson) as PaginationModel;
          const purchases = response.body as PurchaseModel[];
          const data: PaginatedPurchase = { ...pagination, purchases };
          // console.log(response);
          return data;
        })
      );
  }
}
