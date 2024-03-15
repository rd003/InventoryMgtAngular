import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { CategoryStore } from "../category/ui/category.store";
import { ProductStore } from "./product.store";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ProductListComponent } from "./ui/product-list.component";
import { ProductFilterComponent } from "./ui/product-filter.component";
import { Product } from "./product.model";
import { ProductPaginatorComponent } from "./ui/product-paginator.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog } from "@angular/material/dialog";
import { Subject, takeUntil, tap } from "rxjs";
import { ProductDialogComponent } from "./ui/product-dialog.component";
import { CategoryModel } from "../category/category.model";
import { MatButtonModule } from "@angular/material/button";

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
    MatButtonModule,
  ],
  providers: [
    provideComponentStore(CategoryStore),
    provideComponentStore(ProductStore),
  ],
  template: `
    <div style="display: flex;align-items:center;gap:5px;margin-bottom:8px">
      <span style="font-size: 26px;font-weight:bold"> Products </span>
      <button
        mat-raised-button
        color="primary"
        (click)="onAddUpdate('Add Product')"
      >
        Add More
      </button>
    </div>
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
export class ProductComponent implements OnDestroy {
  productStore = inject(ProductStore);
  categoryStore = inject(CategoryStore);
  dialog = inject(MatDialog);
  destroyed$ = new Subject<boolean>();
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

  onAddUpdate(action: string, product: Product | null = null) {
    let categories: CategoryModel[] = [];
    this.categoryStore.vm$
      .pipe(
        takeUntil(this.destroyed$),
        tap((a) => {
          categories = a.categories;
        })
      )
      .subscribe();
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: { product, title: action + " Book", categories },
    });

    dialogRef.componentInstance.sumbit
      .pipe(takeUntil(this.destroyed$))
      .subscribe((submittedProduct) => {
        if (!submittedProduct) return;
        if (submittedProduct.id) {
          // update book
        } else {
          // add book
        }
        // TODO: lines below only executed, when we have added books successfully
        dialogRef.componentInstance.productForm.reset();
        dialogRef.componentInstance.onCanceled();
      });
  }
  constructor() {}
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
