import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { PurchaseStore } from "./purchase.store";
import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { PurchaseListComponent } from "./ui/purchase-list.component";

@Component({
  selector: "app-purchase",
  standalone: true,
  imports: [AsyncPipe, JsonPipe, PurchaseListComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(PurchaseStore)],
  styles: [``],
  template: `
    <h1>Purchases</h1>
    <ng-container *ngIf="this.purchaseStore.vm$ | async as vm">
      <app-purchase-list [purchases]="vm.purchases" />
    </ng-container>
  `,
})
export class PurchaseComponent {
  purchaseStore = inject(PurchaseStore);
}
