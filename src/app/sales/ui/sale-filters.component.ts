import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { getDateWithoutTimezone } from "../../utils/date-utils";
import { debounceTime, tap } from "rxjs";

@Component({
  selector: "app-sale-filters",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],

  template: `
    <mat-form-field appearance="outline" style="width: 300px;">
      <mat-label>Product Name</mat-label>
      <input [formControl]="productName" matInput />
    </mat-form-field>

    <mat-form-field appearance="outline" style="width: 300px;">
      <mat-date-range-input disabled [formGroup]="range" [rangePicker]="picker">
        <input
          matStartDate
          formControlName="dateFrom"
          placeholder="Start date"
        />
        <input matEndDate formControlName="dateTo" placeholder="End date" />
      </mat-date-range-input>
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-date-range-picker #picker disabled="false"></mat-date-range-picker>
    </mat-form-field>

    <button
      mat-raised-button
      color="accent"
      style="height: 54px;width:100px;font-size:16px"
      (click)="clearFilters()"
    >
      Clear
    </button>
  `,
  styles: [
    `
      :host {
        display: flex;
        gap: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleFiltersComponent {
  @Output() searchProduct = new EventEmitter<string | null>();
  @Output() filterByPurchaseDate = new EventEmitter<{
    dateFrom: string | null;
    dateTo: string | null;
  }>();
  @Output() clearFilter = new EventEmitter<void>();

  productName = new FormControl<string>("");
  range = new FormGroup({
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
  });

  clearFilters() {
    this.range.patchValue({ dateFrom: null, dateTo: null });
    this.productName.setValue(null);
    this.clearFilter.emit();
  }

  constructor() {
    this.productName.valueChanges
      .pipe(
        debounceTime(500),
        tap((v) => {
          this.searchProduct.emit(v);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.range.valueChanges
      .pipe(
        tap((v) => {
          if (v.dateFrom && v.dateTo) {
            this.filterByPurchaseDate.emit({
              dateFrom: getDateWithoutTimezone(v.dateFrom),
              dateTo: getDateWithoutTimezone(v.dateTo),
            });
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
