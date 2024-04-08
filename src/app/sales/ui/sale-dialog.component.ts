import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
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
  template: `
    <h1 mat-dialog-title>{{ data.title }}</h1>
    <div mat-dialog-content></div>
    <div mat-dialog-actions>
      <button mat-raised-button color="primary">Save</button>
      <button mat-raised-button color="warn">Close</button>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SaleDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      purchase: SaleModel | null;
      products: ProductWithStock[];
    }
  ) {}
}
