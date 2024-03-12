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

  addCategory(category: CategoryModel): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(this.apiUrl, category);
  }

  updateCategory(category: CategoryModel): Observable<CategoryModel> {
    console.log(category);
    const url = `${this.apiUrl}/${category.id}`;
    return this.http.put<CategoryModel>(url, category);
  }

  deleteCategory(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
  getCategory(id: number): Observable<CategoryModel> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<CategoryModel>(url);
  }

  getCategories(searchTerm?: string): Observable<CategoryModel[]> {
    let url = this.apiUrl;
    if (searchTerm) {
      url += `?searchTerm=${searchTerm}`;
    }
    return this.http.get<CategoryModel[]>(url);
  }
}
