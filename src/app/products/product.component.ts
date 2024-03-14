import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { CategoryStore } from "../category/ui/category.store";
import { ProductStore } from "./product.store";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ProductListComponent } from "./ui/product-list.component";
import { ProductFilterComponent } from "./ui/product-filter.component";
import { Product } from "./product.model";
import { ProductPaginatorComponent } from "./ui/product-paginator.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    ProductListComponent,
    ProductFilterComponent,
    ProductPaginatorComponent,
    MatProgressSpinnerModule,
  ],
  providers: [
    provideComponentStore(CategoryStore),
    provideComponentStore(ProductStore),
  ],
  template: `
    <h1>Products</h1>
    <ng-container *ngIf="vm$ | async as vm" style="position: relative;">
      <div *ngIf="vm.loading" class="spinner-center">
        <mat-spinner diameter="50"></mat-spinner>
      </div>
      <app-product-filter (filter)="onSearch($event)" />
      <div *ngIf="vm.products && vm.products.length > 0; else no_records">
        <app-product-list
          [products]="vm.products"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
        />
        <app-product-paginator
          (pageSelect)="onPageSelect($event)"
          [totalRecords]="vm.totalRecords"
        />
      </div>
      <ng-template #no_records>
        <p style="margin-top:20px;font-size:21px">
          No records found
        </p></ng-template
      >
    </ng-container>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  productStore = inject(ProductStore);
  categoryStore = inject(CategoryStore);
  vm$ = this.productStore.vm$;

  onPageSelect(pageData: { page: number; limit: number }) {
    this.productStore.setPage(pageData.page);
    this.productStore.setPageLimit(pageData.limit);
  }

  onSearch(search: string | null) {
    this.productStore.setSearchTerm(search);
  }

  onEdit(product: Product) {
    console.log(product);
  }

  onDelete(product: Product) {
    console.log(product);
  }
  constructor() {}
}
