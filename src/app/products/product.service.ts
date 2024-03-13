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
}
