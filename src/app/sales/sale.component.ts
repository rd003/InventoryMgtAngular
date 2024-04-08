import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { provideComponentStore } from "@ngrx/component-store";
import { SaleStore } from "./sale.store";
import { ProductService } from "../products/product.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SaleListComponent } from "./ui/sale-list.component";
import { SaleFiltersComponent } from "./ui/sale-filters.component";
import { SaleModel } from "../category/sale.model";
import { capitalize } from "../utils/init-cap.util";
import { ProductWithStock } from "../products/product-with-stock.model";
import { Observable } from "rxjs";

@Component({
  selector: "app-sale",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    SaleListComponent,
    SaleFiltersComponent,
  ],
  providers: [provideComponentStore(SaleStore)],
  styles: [``],
  template: `
    <ng-container *ngIf="products$ | async as products">
      <div style="display: flex;align-items:center;gap:5px;margin-bottom:8px">
        <span style="font-size: 26px;font-weight:bold"> Sales </span>
        <button mat-raised-button color="primary" (click)="({})">
          Add More
        </button>

        <ng-container *ngIf="this.saleStore.vm$ | async as vm">
          @if(vm.loading){
          <div class="spinner-center">
            <mat-spinner diameter="50"></mat-spinner>
          </div>
          } @else {
          <!-- <div *ngIf="vm.sales && vm.sales.length > 0; else no_records"></div>
        <ng-template #no_records>
             <p style="margin-top:20px;font-size:21px">
            No records found
          </p></ng-template
        </ng-template> -->

          }
        </ng-container>
        <app-sale-list (edit)="onAddUpdate('Update sale', $event, products)" />
      </div>
    </ng-container>
  `,
})
export class SaleComponent {
  saleStore = inject(SaleStore);
  productService = inject(ProductService);
  products$: Observable<ProductWithStock[]> =
    this.productService.getAllProductsWithStock();

  onSort(sortData: { sortColumn: string; sortDirection: "asc" | "desc" }) {
    this.saleStore.setSortColumn(capitalize(sortData.sortColumn));
    this.saleStore.setSortDirection(sortData.sortDirection);
  }

  onAddUpdate(
    action: string,
    sale: SaleModel | null = null,
    products: ProductWithStock[]
  ) {}

  onDelete(sale: SaleModel) {
    if (window.confirm("Are you sure to delete?")) {
      this.saleStore.deleteSale(sale.id);
    }
  }

  constructor() {}
}
