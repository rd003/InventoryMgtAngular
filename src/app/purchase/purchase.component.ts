import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { PurchaseStore } from "./purchase.store";
import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { PurchaseListComponent } from "./ui/purchase-list.component";
import { capitalize } from "../utils/init-cap.util";
import { PurchaseModel } from "./purchase.model";
import { PurchasePaginatorComponent } from "./ui/purchase-pagination.component";
import { PurchaseFilters } from "./ui/purchase-filters.component";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Observable, Subject, map, takeUntil, tap } from "rxjs";
import { PurchaseDialogComponent } from "./ui/purchase-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ProductService } from "../products/product.service";
import { ProductWithStock } from "../products/product-with-stock.model";

@Component({
  selector: "app-purchase",
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    PurchaseListComponent,
    NgIf,
    PurchasePaginatorComponent,
    PurchaseFilters,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(PurchaseStore)],
  styles: [``],
  template: `
    <ng-container *ngIf="products$ | async as products">
      <div style="display: flex;align-items:center;gap:5px;margin-bottom:8px">
        <span style="font-size: 26px;font-weight:bold"> Purchases </span>
        <button
          mat-raised-button
          color="primary"
          (click)="onAddUpdate('Add Purchase', null, products)"
        >
          Add More
        </button>
      </div>
      <ng-container *ngIf="this.purchaseStore.vm$ | async as vm">
        <div *ngIf="vm.loading" class="spinner-center">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
        <div *ngIf="vm.purchases && vm.purchases.length > 0">
          <app-purchase-filters
            (searchProduct)="onSearch($event)"
            (filterByPurchaseDate)="onDateFilter($event)"
            (clearFilter)="onClearFilter()"
          />
          <app-purchase-list
            [purchases]="vm.purchases"
            (sort)="onSort($event)"
            (delete)="onDelete($event)"
            (edit)="onAddUpdate('Edit purchase', $event, products)"
          />

          <app-purchase-paginator
            [totalRecords]="vm.totalRecords"
            (pageSelect)="onPageSelect($event)"
          />
        </div>
        <ng-template #no_records>
          <p style="margin-top:20px;font-size:21px">
            No records found
          </p></ng-template
        >
      </ng-container>
    </ng-container>
  `,
})
export class PurchaseComponent implements OnDestroy {
  purchaseStore = inject(PurchaseStore);
  productService = inject(ProductService);

  products$: Observable<ProductWithStock[]> =
    this.productService.getAllProductsWithStock();

  dialog = inject(MatDialog);
  destroyed$ = new Subject<boolean>();
  onSort(sortData: { sortColumn: string; sortDirection: "asc" | "desc" }) {
    this.purchaseStore.setSortColumn(capitalize(sortData.sortColumn));
    this.purchaseStore.setSortDirection(sortData.sortDirection);
  }

  onPageSelect(pageData: { page: number; limit: number }) {
    this.purchaseStore.setPage(pageData.page);
    this.purchaseStore.setLimit(pageData.limit);
  }

  onSearch(productName: string | null) {
    this.purchaseStore.setProductName(productName);
  }

  onDateFilter(dateRange: { dateFrom: string | null; dateTo: string | null }) {
    if (dateRange.dateFrom && dateRange.dateTo) {
      this.purchaseStore.setDateFilter({ ...dateRange });
    }
  }

  onClearFilter() {
    this.purchaseStore.setDateFilter({ dateFrom: null, dateTo: null });
    this.purchaseStore.setProductName(null);
  }
  onAddUpdate(
    action: string,
    purchase: PurchaseModel | null = null,
    products: ProductWithStock[]
  ) {
    const dialogRef = this.dialog.open(PurchaseDialogComponent, {
      data: { purchase, title: action + " Book", products },
    });

    dialogRef.componentInstance.sumbit
      .pipe(takeUntil(this.destroyed$))
      .subscribe((submittedPurchase) => {
        if (!submittedPurchase) return;
        if (submittedPurchase.id && submittedPurchase.id > 0) {
          // update book
          this.purchaseStore.updatePurchase(submittedPurchase);
        } else {
          // add book
          this.purchaseStore.addPurchase(submittedPurchase);
        }
        dialogRef.componentInstance.purchaseForm.reset();
        dialogRef.componentInstance.onCanceled();
      });
  }

  onDelete(purchase: PurchaseModel) {
    if (window.confirm("Are you sure to delete??")) {
      this.purchaseStore.deletePurchase(purchase.id);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
