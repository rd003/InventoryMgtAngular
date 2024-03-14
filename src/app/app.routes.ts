import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "categories",
    loadComponent() {
      return import("./category/category.component").then(
        (a) => a.CategoryComponent
      );
    },
  },
  {
    path: "products",
    loadComponent() {
      return import("./products/product.component").then(
        (a) => a.ProductComponent
      );
    },
  },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "**",
    loadComponent() {
      return import("./not-found.component").then((a) => a.NotFoundComponent);
    },
  },
];
