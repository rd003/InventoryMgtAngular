import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Output,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { Product } from "../product.model";
import { CategoryModel } from "../../category/category.model";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: "app-product-dialog",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
  ],
  template: `
    <h1 mat-dialog-title>
      {{ data.title }}
    </h1>
    <div mat-dialog-content>
      <form class="product-form" [formGroup]="productForm">
        <input type="hidden" formControlName="id" />

        <mat-form-field [appearance]="'outline'">
          <mat-label>Product</mat-label>
          <input matInput formControlName="productName" />
        </mat-form-field>

        <mat-form-field [appearance]="'outline'">
          <mat-label>Category</mat-label>
          <mat-select formControlName="categoryId">
            @for (category of data.categories; track category.id) {
            <mat-option value="category.id">{{
              category.categoryName
            }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field [appearance]="'outline'">
          <mat-label>Price</mat-label>
          <input matInput formControlName="price" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        disabled="productForm.invalid"
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
      .product-form {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      mat-form-field {
        width: 500px;
      }
      // .product-form {
      //   display: grid;
      //   grid-template-columns: repeat(
      //     3,
      //     1fr
      //   ); /* Three columns with equal width */
      //   gap: 16px; /* Adjust the gap between columns as needed */
      // }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDialogComponent {
  @Output() sumbit = new EventEmitter<Product>();
  productForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    productName: new FormControl<string>("", Validators.required),
    categoryId: new FormControl<number>(0, Validators.required),
    price: new FormControl<number>(0, Validators.required),
  });

  onCanceled() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product: Product = Object.assign(this.productForm.value);
      this.sumbit.emit(product);
    }
  }

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      product: Product | null;
      title: string;
      categories: CategoryModel[];
    }
  ) {
    if (data.product != null) {
      this.productForm.patchValue(data.product);
    }
  }
}
