import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginatedSale, SaleModel } from "../category/sale.model";
import { Observable, map } from "rxjs";
import { PaginationModel } from "../shared/models/pagination.model";

@Injectable({ providedIn: "root" })
export class SaleService {
  private readonly baseUrl = environment.API_BASE_URL + "/sales";
  private readonly http = inject(HttpClient);

  addSale(sale: SaleModel): Observable<SaleModel> {
    return this.http.post<SaleModel>(this.baseUrl, sale);
  }

  updateSale(sale: SaleModel): Observable<SaleModel> {
    const url = `${this.baseUrl}/${sale.id}`;
    return this.http.put<SaleModel>(url, sale);
  }

  deleteSale(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<any>(url);
  }

  getSaleById(id: string): Observable<SaleModel> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<SaleModel>(url);
  }

  getSales(
    page = 1,
    limit = 4,
    productName: string | null = null,
    dateFrom: string | null = null,
    dateTo: string | null = null,
    sortColumn = "Id",
    sortDirection: "asc" | "desc" = "asc"
  ): Observable<PaginatedSale> {
    let params = new HttpParams()
      .set("page", page)
      .set("limit", limit)
      .set("sortColumn", sortColumn)
      .set("sortDirection", sortDirection);
    if (productName) params = params.set("productName", productName);
    if (dateFrom && dateTo) {
      params = params.set("dateFrom", dateFrom);
      params = params.set("dateTo", dateTo);
    }
    return this.http
      .get(this.baseUrl, {
        params: params,
        observe: "response",
      })
      .pipe(
        map((response) => {
          const pagination: PaginationModel = JSON.parse(
            response.headers.get("X-Pagination") as string
          );
          const sales = response.body as SaleModel[];
          const paginatedSale: PaginatedSale = { ...pagination, sales };
          return paginatedSale;
        })
      );

    //
  }
}
