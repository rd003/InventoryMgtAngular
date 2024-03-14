import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { CategoryStore } from "../category/ui/category.store";
import { ProductStore } from "./product.store";
import { AsyncPipe, JsonPipe, NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, JsonPipe],
  providers: [
    provideComponentStore(CategoryStore),
    provideComponentStore(ProductStore),
  ],
  template: `
    <h1>Products</h1>
    <ng-container *ngIf="vm$ | async as vm">
      {{ vm | json }}
    </ng-container>

    <button (click)="productStore.setSearchTerm('pencil')">
      search pencil
    </button>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  productStore = inject(ProductStore);
  categoryStore = inject(CategoryStore);
  vm$ = this.productStore.vm$;
  constructor() {}
}
