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
  ],
  template: ` <h1 mat-dialog-title>
      {{ data.title }}
    </h1>
    <div mat-dialog-content>
      <form class="purchase-form" [formGroup]="productForm">
        <input type="hidden" formControlName="id" />

        <mat-form-field [appearance]="'outline'">
          <mat-label>Purchase Date</mat-label>
          <input matInput formControlName="purchaseDate" />
        </mat-form-field>

        <mat-form-field [appearance]="'outline'">
          <mat-label>Product</mat-label>
          <input matInput formControlName="productId" />
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
        [disabled]="productForm.invalid"
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
  productForm: FormGroup = new FormGroup({
    id: new FormControl<number>(0),
    purchaseDate: new FormControl<string>("", Validators.required),
    productId: new FormControl<number | null>(null, Validators.required),
    price: new FormControl<number>(0, Validators.required),
    quantity: new FormControl<number>(0, Validators.required),
  });

  onCanceled() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.productForm.valid) {
      const purchase: PurchaseModel = Object.assign(
        this.productForm.value
      ) as PurchaseModel;
      this.sumbit.emit(purchase);
    }
  }
  constructor(
    public dialogRef: MatDialogRef<PurchaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      purchase: PurchaseModel | null;
    }
  ) {}
}
