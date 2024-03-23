import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { PurchaseStore } from "./purchase.store";
import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { PurchaseListComponent } from "./ui/purchase-list.component";
import { capitalize } from "../utils/init-cap.util";
import { PurchaseModel } from "./purchase.model";
import { PurchasePaginatorComponent } from "./ui/purchase-pagination.component";
import { PurchaseFilters } from "./ui/purchase-filters.component";

@Component({
  selector: "app-purchase",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(PurchaseStore)],
  styles: [``],
  template: `
    <h1>Purchases</h1>
    <ng-container *ngIf="this.purchaseStore.vm$ | async as vm">
      <app-purchase-filters (searchProduct)="onSearch($event)" />
      <app-purchase-list
        [purchases]="vm.purchases"
        (sort)="onSort($event)"
        (delete)="onDelete($event)"
        (edit)="onAddUpdate('Edit purchase', $event)"
      />

      <app-purchase-paginator
        [totalRecords]="vm.totalRecords"
        (pageSelect)="onPageSelect($event)"
      />
    </ng-container>
  `,
  imports: [
    AsyncPipe,
    JsonPipe,
    PurchaseListComponent,
    NgIf,
    PurchasePaginatorComponent,
    PurchaseFilters,
  ],
})
export class PurchaseComponent {
  purchaseStore = inject(PurchaseStore);

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

  onDateFilter(dateFrom: string | null, dateTo: string | null) {
    if (dateFrom && dateTo) {
      //this.purchaseStore.setDateFilter({ dateFrom, dateTo });
    }
  }
  onAddUpdate(action: string, purchase: PurchaseModel | null = null) {
    //console.log(purchase);
  }

  onDelete(purchase: PurchaseModel) {
    //console.log(purchase);
    window.confirm("Are you sure to delete??");
    {
    }
  }
}
