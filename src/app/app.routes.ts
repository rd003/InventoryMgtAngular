import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
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
