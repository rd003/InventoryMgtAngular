import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { provideComponentStore } from "@ngrx/component-store";
import { SaleStore } from "./sale.store";
import { ProductService } from "../products/product.service";

@Component({
  selector: "app-sale",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, JsonPipe, MatButtonModule],
  providers: [provideComponentStore(SaleStore)],
  styles: [``],
  template: `
    <div style="display: flex;align-items:center;gap:5px;margin-bottom:8px">
      <span style="font-size: 26px;font-weight:bold"> Sales </span>
      <button mat-raised-button color="primary" (click)="({})">Add More</button>

      <ng-container *ngIf="this.saleStore.vm$ | async as vm">
        {{ vm.loading }}
        {{ vm.sales | json }}
      </ng-container>
    </div>
  `,
})
export class SaleComponent {
  saleStore = inject(SaleStore);
  productService = inject(ProductService);

  constructor() {}
}
