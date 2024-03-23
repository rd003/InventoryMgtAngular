import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { PurchaseModel } from "../purchase.model";

@Component({
  selector: "app-purchase-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe],
  styles: [``],
  template: `
    <table
      class="mat-elevation-z8"
      mat-table
      style=" margin-top: 1.5rem;"
      [dataSource]="purchases"
    >
      <!-- <ng-container matColumnDef="productName">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by product"
        >
          Product
        </th>
        <td mat-cell *matCellDef="let element">
          {{ element.productName }}
        </td>
      </ng-container> -->
      <ng-container matColumnDef="purchaseDate">
        <th mat-header-cell *matHeaderCellDef>Purchase Date</th>
        <td mat-cell *matCellDef="let purchase">
          {{ purchase.purchaseDate | date : "dd-MM-yyyy HH:MM" }}
        </td>
      </ng-container>
      <ng-container matColumnDef="productName">
        <th mat-header-cell *matHeaderCellDef>ProductName</th>
        <td mat-cell *matCellDef="let purchase">{{ purchase.productName }}</td>
      </ng-container>
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let purchase">{{ purchase.price }}</td>
      </ng-container>

      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Quantity</th>
        <td mat-cell *matCellDef="let purchase">{{ purchase.quantity }}</td>
      </ng-container>

      <ng-container matColumnDef="totalPrice">
        <th mat-header-cell *matHeaderCellDef>TotalPrice</th>
        <td mat-cell *matCellDef="let purchase">
          {{ purchase.price * purchase.quantity }}
        </td>
      </ng-container>

      <ng-container matColumnDef="action">
        <th mat-header-cell *matHeaderCellDef>Action</th>
        <td mat-cell *matCellDef="let purchase">
          <button
            mat-mini-fab
            color="primary"
            aria-label="Edit"
            (click)="edit.emit(purchase)"
          >
            <mat-icon>edit</mat-icon>
          </button>

          <button
            mat-mini-fab
            color="warn"
            aria-label="Delete"
            (click)="delete.emit(purchase)"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class PurchaseListComponent {
  @Input({ required: true }) purchases!: PurchaseModel[];
  @Output() edit = new EventEmitter<PurchaseModel>();
  @Output() delete = new EventEmitter<PurchaseModel>();

  displayedColumns = [
    "purchaseDate",
    "productName",
    "price",
    "quantity",
    "totalPrice",
    "action",
  ];
}
