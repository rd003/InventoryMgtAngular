import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { PurchaseStore } from "./purchase.store";
import { AsyncPipe, JsonPipe } from "@angular/common";

@Component({
  selector: "app-purchase",
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(PurchaseStore)],
  styles: [``],
  template: `
    <h1>Purchases</h1>

    {{ vm$ | async | json }}
  `,
})
export class PurchaseComponent {
  purchaseStore = inject(PurchaseStore);
  vm$ = this.purchaseStore.vm$;
}
