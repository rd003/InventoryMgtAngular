import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Output,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { PurchaseModel } from "../purchase.model";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { getDateWithoutTimezone } from "../../utils/date-utils";
import { Observable, map, startWith, tap } from "rxjs";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-purchase-dialog",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  providers: [provideNativeDateAdapter()],
  template: ` <h1 mat-dialog-title>
      {{ data.title }}
    </h1>
    <div mat-dialog-content>
      <form class="purchase-form" [formGroup]="purchaseForm">
        <input type="hidden" formControlName="id" />

        <mat-form-field [appearance]="'outline'">
          <mat-label>Purchase Date</mat-label>
          <input
            matInput
            formControlName="purchaseDate"
            [matDatepicker]="picker"
          />
          <!-- <mat-hint>MM/DD/YYYY</mat-hint> -->
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
            disabled="false"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker disabled="false"></mat-datepicker>
        </mat-form-field>

        <mat-form-field class="example-full-width">
          <mat-label>Product</mat-label>
          <input
            type="text"
            placeholder="Pick one"
            aria-label="Product"
            matInput
            formControlName="productId"
            [matAutocomplete]="auto"
          />
          <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
            @for (option of filteredOptions | async; track option) {
            <mat-option [value]="option">{{ option }}</mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>

        <mat-form-field [appearance]="'outline'">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" />
        </mat-form-field>

        <mat-form-field [appearance]="'outline'">
          <mat-label>Quntity</mat-label>
          <input matInput type="number" formControlName="quantity" />
        </mat-form-field>

        <mat-form-field [appearance]="'outline'">
          <mat-label>Total</mat-label>
          <input matInput type="number" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="purchaseForm.invalid"
      >
        Save
      </button>
      <button mat-raised-button color="warn" (click)="onCanceled()">
        Close
      </button>
    </div>`,
  styles: [
    `
      .purchase-form {
        padding: 10px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      mat-form-field {
        width: 400px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseDialogComponent {
  @Output() sumbit = new EventEmitter<PurchaseModel>();
  filteredOptions!: Observable<string[]> | undefined;
  options: string[] = ["One", "Two", "Three"];

  purchaseForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    purchaseDate: new FormControl<string | null>("", Validators.required),
    productId: new FormControl<number | null>(null, Validators.required),
    price: new FormControl<number>(0, Validators.required),
    quantity: new FormControl<number>(0, Validators.required),
  });

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onCanceled() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.purchaseForm.valid) {
      //   console.log(this.purchaseForm.get("purchaseDate")?.value);
      const purchase: PurchaseModel = Object.assign(
        this.purchaseForm.value
      ) as PurchaseModel;
      // console.log(new Date(purchase.purchaseDate)); //Tue Mar 26 2024 00:00:00 GMT+0530 (India Standard Time)
      const purchaseDate = getDateWithoutTimezone(
        new Date(purchase.purchaseDate)
      );
      this.sumbit.emit({ ...purchase, purchaseDate });
    }
  }
  constructor(
    public dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      purchase: PurchaseModel | null;
    }
  ) {
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || '')),
    // );
    this.filteredOptions = this.purchaseForm
      .get<string>("productId")
      ?.valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value || ""))
      );
  }
}
