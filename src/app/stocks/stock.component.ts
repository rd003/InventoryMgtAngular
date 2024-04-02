import { ChangeDetectionStrategy, Component } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { StockStore } from "./stock.store";
import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";

@Component({
  selector: "app-stock",
  standalone: true,
  imports: [AsyncPipe, JsonPipe, NgIf],
  providers: [provideComponentStore(StockStore)],
  template: ``,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockComponent {}
