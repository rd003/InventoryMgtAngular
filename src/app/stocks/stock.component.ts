import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { StockStore } from "./stock.store";
import { AsyncPipe, NgIf } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { StockListComponent } from "./ui/stock-list.component";
import { capitalize } from "../utils/init-cap.util";

@Component({
  selector: "app-stock",
  standalone: true,
  imports: [AsyncPipe, NgIf, MatProgressSpinnerModule, StockListComponent],
  providers: [provideComponentStore(StockStore)],
  template: `
    <span style="font-size: 26px;font-weight:bold;display:block"> Stock </span>
    <ng-container *ngIf="stockStore.vm$ | async as vm">
      @if(vm.loading){
      <div class="spinner-center">
        <mat-spinner diameter="50"></mat-spinner>
      </div>
      } @else {
      <div *ngIf="vm.stocks && vm.stocks.length > 0; else no_records">
        <app-stock-list [stocks]="vm.stocks" (sort)="onSort($event)" />
      </div>
      <ng-template #no_records>
        <p style="margin-top:20px;font-size:21px">No records found</p>
      </ng-template>
      }
    </ng-container>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockComponent {
  stockStore = inject(StockStore);

  onSort(sortData: { sortColumn: string; sortDirection: "asc" | "desc" }) {
    this.stockStore.setSortColumn(capitalize(sortData.sortColumn));
    this.stockStore.setSortDirection(sortData.sortDirection);
  }
}
