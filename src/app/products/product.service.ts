import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { PaginatedProduct, Product } from "./product.model";
import { Observable, delay, map } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginationModel } from "../shared/models/pagination.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  #http = inject(HttpClient);
  #baseUrl = environment.API_BASE_URL + "/products";

  addProduct(product: Product): Observable<Product> {
    return this.#http.post<Product>(this.#baseUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    const url = `${this.#baseUrl}\${product.id}`;
    return this.#http.put<Product>(url, product);
  }

  deleteProduct(id: number): Observable<any> {
    const url = `${this.#baseUrl}\${product.id}`;
    return this.#http.delete<any>(url);
  }

  getProduct(id: number): Observable<Product> {
    const url = `${this.#baseUrl}\${product.id}`;
    return this.#http.get<Product>(url);
  }

  getProducts(
    page = 1,
    limit = 4,
    searchTerm: string | null = null,
    sortColumn: string | null = null,
    sortDirection: string | null = null
  ): Observable<PaginatedProduct> {
    let parameters = new HttpParams();
    parameters = parameters.set("page", page);
    parameters = parameters.set("limit", limit);
    if (searchTerm) parameters = parameters.set("searchTerm", searchTerm);
    if (sortColumn) parameters = parameters.set("sortColumn", sortColumn);
    if (sortDirection)
      parameters = parameters.set("sortDirection", sortDirection);
    return this.#http
      .get(this.#baseUrl, {
        observe: "response",
        params: parameters,
      })
      .pipe(
        map((response) => {
          const paginationHeader = response.headers.get(
            "X-Pagination"
          ) as string;
          const paginationData: PaginationModel = JSON.parse(paginationHeader);
          const products = response.body as Product[];
          const productResponse: PaginatedProduct = {
            ...paginationData,
            products,
          };
          return productResponse;
        })
      )
      .pipe(delay(800));
  }
}
