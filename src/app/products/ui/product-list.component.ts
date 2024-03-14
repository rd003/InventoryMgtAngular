import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { Product } from "../product.model";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-product-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe],
  styles: [``],
  template: `
    <table
      style=" margin-top: 1.5rem;"
      mat-table
      [dataSource]="products"
      class="mat-elevation-z8"
    >
      <ng-container matColumnDef="productName">
        <th mat-header-cell *matHeaderCellDef>Product</th>
        <td mat-cell *matCellDef="let element">
          {{ element.productName }}
        </td>
      </ng-container>
      <ng-container matColumnDef="categoryName">
        <th mat-header-cell *matHeaderCellDef>Category</th>
        <td mat-cell *matCellDef="let element">{{ element.categoryName }}</td>
      </ng-container>
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let element">
          {{ element.price }}
        </td>
      </ng-container>

      <ng-container matColumnDef="createDate">
        <th mat-header-cell *matHeaderCellDef>Create Date</th>
        <td mat-cell *matCellDef="let element">
          {{ element.createDate | date : "dd-MMM-yyy HH:MM" }}
        </td>
      </ng-container>

      <ng-container matColumnDef="updateDate">
        <th mat-header-cell *matHeaderCellDef>Update Date</th>
        <td mat-cell *matCellDef="let element">
          {{ element.updateDate | date : "dd-MMM-yyy HH:MM" }}
        </td>
      </ng-container>

      <ng-container matColumnDef="action">
        <th mat-header-cell *matHeaderCellDef>Action</th>
        <td mat-cell *matCellDef="let element">
          <div style="display: flex;gap:5px;align-items:center">
            <button
              mat-mini-fab
              color="primary"
              aria-label="Edit"
              (click)="edit.emit(element)"
            >
              <mat-icon>edit</mat-icon>
            </button>

            <button
              mat-mini-fab
              color="warn"
              aria-label="Delete"
              (click)="delete.emit(element)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class ProductListComponent {
  @Input({ required: true }) products!: Product[];
  @Output() delete = new EventEmitter<Product>();
  @Output() edit = new EventEmitter<Product>();

  displayedColumns = [
    "productName",
    "price",
    "categoryName",
    "createDate",
    "updateDate",
    "action",
  ];
}
