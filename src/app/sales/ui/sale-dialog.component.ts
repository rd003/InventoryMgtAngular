import { AsyncPipe } from "@angular/common";
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
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { SaleModel } from "../../category/sale.model";
import { ProductWithStock } from "../../products/product-with-stock.model";
import { Observable, Subject, map, tap } from "rxjs";
import { provideNativeDateAdapter } from "@angular/material/core";
import { getDateWithoutTimezone } from "../../utils/date-utils";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-sale-dialog",
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
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content>
      <form class="sale-form" [formGroup]="saleForm">
        <input type="hidden" formControlName="id" />

        <mat-form-field appearance="outline">
          <mat-label>Selling date</mat-label>
          <input
            matInput
            formControlName="sellingDate"
            [matDatepicker]="picker"
          />
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
            disabled="false"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker disabled="false"></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
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
            <mat-option [value]="option.id"
              >{{ option.productName }} ({{
                option.quantity
              }}
              remain)</mat-option
            >
            }
          </mat-autocomplete>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Price</mat-label>
          <input type="number" formControlName="price" matInput />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Quantity</mat-label>
          <input type="number" formControlName="quantity" matInput />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea
            formControlName="description"
            matInput
            cdkTextareaAutosize
            cdkAutosizeMinRows="1"
            cdkAutosizeMaxRows="5"
          >
          </textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Total Price</mat-label>
          <input type="number" formControlName="totalPrice" matInput />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="saleForm.invalid"
      >
        Save
      </button>
      <button mat-raised-button color="warn" (click)="onCanceled()">
        Close
      </button>
    </div>
  `,
  styles: [
    `
      .sale-form {
        padding: 10px;
        display: grid;
        grid-template-columns: repeat(2, fr);
        gap: 20px;
      }
      mat-form-field {
        width: 400px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleDialogComponent {
  @Output() submit = new EventEmitter<SaleModel>();
  filteredProducts$!: Observable<ProductWithStock[]> | undefined;
  selectedProductQuantity: number = 0;
  saleForm = new FormGroup({
    id: new FormControl<number>(0),
    sellingDate: new FormControl<string | null>("", Validators.required),
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

    this.selectedProductQuantity = product.quantity;
    this._setPrice(product.price);
    this._setTotalPrice();
    return product.productName;
  }

  private _setPrice(price: number) {
    this.saleForm.get("price")?.setValue(price);
  }

  private _setTotalPrice() {
    const price = this.saleForm.get("price")?.value;
    const quantity = this.saleForm.get("quantity")?.value;
    if (price && quantity) {
      const totalPrice = price * quantity;
      this.saleForm.get("totalPrice")?.setValue(totalPrice);
    }
  }

  updateProductListQuatity(productId: number, quantity: number) {
    const updatedProducts = this.data.products.map((product) => {
      if (product.id !== productId) return product;
      return {
        ...product,
        quantity: product.quantity - quantity,
      };
    });
    console.log(updatedProducts);

    this.data.products = [...updatedProducts];
  }

  onCanceled() {
    this.dialogRef.close();
  }

  onSubmit() {
    const sale = Object.assign(this.saleForm.value) as SaleModel;
    if (sale.quantity < 1) {
      window.alert(`Qauntity must be greater than 0`);
      return;
    }
    if (this.selectedProductQuantity === null) return;
    if (this.selectedProductQuantity < sale.quantity) {
      window.alert(`only ${this.selectedProductQuantity} items are remained.`);
      return;
    }
    const sellingDate = getDateWithoutTimezone(new Date(sale.sellingDate));
    this.submit.emit({ ...sale, sellingDate });
  }

  constructor(
    public dialogRef: MatDialogRef<SaleDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      sale: SaleModel | null;
      products: ProductWithStock[];
    }
  ) {
    // if data.sale is not null, it means it is a update form. Then we need to set values to form fields.
    if (data.sale) {
      this.saleForm.patchValue(data.sale);
      this._setTotalPrice();
    }

    // on value changes of productId
    this.filteredProducts$ = this.saleForm
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

    // if quantity changes
    this.saleForm
      .get("quantity")
      ?.valueChanges.pipe(
        tap((quantity) => {
          if (quantity && typeof quantity === "number") {
            this._setTotalPrice();
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    // if price changes

    this.saleForm
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
