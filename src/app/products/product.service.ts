import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Product } from "./product.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

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

  getProducts(): Observable<Product> {
    return this.#http.get<Product>(this.#baseUrl);
  }
}
