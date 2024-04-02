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
    path: "purchases",
    loadComponent() {
      return import("./purchase/purchase.component").then(
        (a) => a.PurchaseComponent
      );
    },
  },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
  {
    path: "stock",
    loadComponent: () =>
      import("./stocks/stock.component").then((a) => a.StockComponent),
  },
  {
    path: "**",
    loadComponent() {
      return import("./not-found.component").then((a) => a.NotFoundComponent);
    },
  },
];
