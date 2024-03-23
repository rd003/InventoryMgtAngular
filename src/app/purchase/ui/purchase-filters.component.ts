import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { debounceTime, tap } from "rxjs";

@Component({
  selector: "app-purchase-filters",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [``],
  template: `
    <mat-form-field appearance="outline" style="width: 400px;">
      <mat-label>Product Name</mat-label>
      <input [formControl]="productName" matInput />
    </mat-form-field>
  `,
})
export class PurchaseFilters {
  @Output() searchProduct = new EventEmitter<string | null>();
  @Output() searchByDateFrom = new EventEmitter<string | null>();
  @Output() searchByDateTo = new EventEmitter<string | null>();

  productName = new FormControl<string>("");
  dateFrom = new FormControl<string>("");
  dateTo = new FormControl<string>("");

  constructor() {
    this.dateFrom.valueChanges
      .pipe(
        debounceTime(500),
        tap((v) => {
          this.searchByDateFrom.emit(v);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.dateTo.valueChanges
      .pipe(
        debounceTime(500),
        tap((v) => {
          this.searchByDateTo.emit(v);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.productName.valueChanges
      .pipe(
        debounceTime(500),
        tap((v) => {
          this.searchProduct.emit(v);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
