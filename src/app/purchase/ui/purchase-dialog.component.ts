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
import { Observable, Subject, map, tap } from "rxjs";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AsyncPipe } from "@angular/common";
import { ProductWithStock } from "../../products/product-with-stock.model";

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

        <mat-form-field>
          <mat-label>Product</mat-label>
          <input
            type="text"
            placeholder="Search product"
            aria-label="Product"
            matInput
            formControlName="productId"
            [matAutocomplete]="auto"
          />
          <mat-autocomplete
            autoActiveFirstOption
            #auto="matAutocomplete"
            [displayWith]="displayFn.bind(this)"
          >
            @for (option of filteredProducts$|async; track option.id) {
            <mat-option [value]="option.id">{{
              option.productName
            }}</mat-option>
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
          <input matInput type="number" formControlName="totalPrice" />
        </mat-form-field>

        <mat-form-field [appearance]="'outline'">
          <mat-label>Description</mat-label>
          <textarea
            matInput
            formControlName="description"
            cdkTextareaAutosize
            cdkAutosizeMinRows="1"
            cdkAutosizeMaxRows="5"
          >
          </textarea>
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
  filteredProducts$!: Observable<ProductWithStock[]> | undefined;

  purchaseForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    purchaseDate: new FormControl<string | null>("", Validators.required),
    productId: new FormControl<number | null>(null, Validators.required),
    price: new FormControl<number>(0, Validators.required),
    quantity: new FormControl<number>(1, Validators.required),
    description: new FormControl<string>(""),
    totalPrice: new FormControl<number>({ value: 0, disabled: true }),
  });

  displayFn(productId: number | null) {
    if (!productId || !this.data.products) return "";

    const product = this.data.products.find((a) => a.id === productId);

    if (!product) return "";
    this._setPrice(product.price);
    this._setTotalPrice();
    return product.productName;
  }

  private _setPrice(price: number) {
    this.purchaseForm.get("price")?.setValue(price);
  }

  private _setTotalPrice() {
    const quantity: number | null = this.purchaseForm.get("quantity")?.value;
    const price: number | null = this.purchaseForm.get("price")?.value;
    if (price && quantity) {
      const totalPrice = price * quantity;
      this.purchaseForm.get("totalPrice")?.setValue(totalPrice);
    }
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
      products: ProductWithStock[];
    }
  ) {
    if (data.purchase) {
      this.purchaseForm.patchValue(data.purchase);
      this._setTotalPrice();
    }
    // on value changes of productId
    this.filteredProducts$ = this.purchaseForm
      .get<string>("productId")
      ?.valueChanges.pipe(
        map((value) => {
          if (!value || typeof value !== "string") return [];
          const searchTerm = value ? value.toLocaleLowerCase() : "";
          const filteredProducts = this.data.products.filter((a) =>
            a.productName?.toLowerCase().includes(searchTerm)
          );
          return filteredProducts;
        })
      );

    // on value changes of quantity
    this.purchaseForm
      .get("quantity")
      ?.valueChanges.pipe(
        tap((qty) => {
          if (qty && typeof qty === "number") {
            this._setTotalPrice();
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    // on value changes of price
    this.purchaseForm
      .get("price")
      ?.valueChanges.pipe(
        tap((price) => {
          if (price && typeof price === "number") {
            this._setTotalPrice();
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
