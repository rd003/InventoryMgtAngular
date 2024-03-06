import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CategoryModel } from "./category.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiUrl = environment.API_BASE_URL + "/categories";
  private http = inject(HttpClient);

  getCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(this.apiUrl);
  }
}
