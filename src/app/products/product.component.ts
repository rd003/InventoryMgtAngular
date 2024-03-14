import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { CategoryStore } from "../category/ui/category.store";
import { ProductStore } from "./product.store";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ProductListComponent } from "./ui/product-list.component";
import { ProductFilterComponent } from "./ui/product-filter.component";
import { Product } from "./product.model";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    ProductListComponent,
    ProductFilterComponent,
  ],
  providers: [
    provideComponentStore(CategoryStore),
    provideComponentStore(ProductStore),
  ],
  template: `
    <h1>Products</h1>
    <ng-container *ngIf="vm$ | async as vm">
      <app-product-filter (filter)="onSearch($event)" />
      <app-product-list
        [products]="vm.products"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
      />
    </ng-container>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  productStore = inject(ProductStore);
  categoryStore = inject(CategoryStore);
  vm$ = this.productStore.vm$;

  onSearch(search: string | null) {
    console.log(search);
  }

  onEdit(product: Product) {
    console.log(product);
  }

  onDelete(product: Product) {
    console.log(product);
  }
  constructor() {}
}
