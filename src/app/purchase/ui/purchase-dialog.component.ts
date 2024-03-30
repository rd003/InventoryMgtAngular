import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
  inject,
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
import { EMPTY, Subject, map, switchMap, takeUntil, tap } from "rxjs";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ProductService } from "../../products/product.service";
import { Product } from "../../products/product.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
            @for (option of filteredProducts; track option.id) {
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
export class PurchaseDialogComponent implements OnDestroy {
  @Output() sumbit = new EventEmitter<PurchaseModel>();
  productService = inject(ProductService);
  filteredProducts!: Product[] | undefined;
  destroy$ = new Subject<boolean>();

  purchaseForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    purchaseDate: new FormControl<string | null>("", Validators.required),
    productId: new FormControl<number | null>(null, Validators.required),
    price: new FormControl<number>(0, Validators.required),
    quantity: new FormControl<number>(1, Validators.required),
    totalPrice: new FormControl<number>({ value: 0, disabled: true }),
  });

  // displayFn(productId: number | null) {
  //   if (!productId) return EMPTY;
  //   return this.productService
  //     .getProduct(productId)
  //     .pipe(map((d) => d.productName));
  // }

  displayFn(productId: number | null) {
    if (!productId || !this.filteredProducts) return "";

    const product = this.filteredProducts.find((a) => a.id === productId);
    if (!product) return "";
    this._setPrice(product);
    this._setTotalPrice();
    return product.productName;
  }

  private _setPrice(product: Product) {
    this.purchaseForm.get("price")?.setValue(product.price);
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
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  constructor(
    public dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      purchase: PurchaseModel | null;
    }
  ) {
    if (data.purchase) {
      this.purchaseForm.patchValue(data.purchase);
      // this.purchaseForm.get("productId")?.setValue(data.purchase.productId);
      this._setTotalPrice();
    }
    // on value changes of productId
    this.purchaseForm
      .get<string>("productId")
      ?.valueChanges.pipe(
        switchMap((value: string | null) => {
          // console.log({ "on value changes": value });
          if (!value) return EMPTY;
          if (typeof value !== "string") return EMPTY;
          return this.productService
            .getProducts(1, 1000, value.toLowerCase(), "Id", "asc")
            .pipe(
              map((data) => {
                // this.purchaseForm.get('price')?.setValue(data.TotalRecords)
                return data.products;
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (products) => (this.filteredProducts = products),
      });

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
