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
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { SaleModel } from "../../category/sale.model";

@Component({
  selector: "app-sale-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatSortModule,
  ],
  template: `
    <table
      mat-table
      [dataSource]="sales"
      class="mat-elevation-z8"
      style="margin-top:1.5 rem;"
      matSort
      (matSortChange)="onSortData($event)"
    >
      <ng-container matColumnDef="sellingDate">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by selling date"
        >
          Purchase Date
        </th>
        <td mat-cell *matCellDef="let purchase">
          {{ purchase.purchaseDate | date : "dd-MM-yyyy HH:MM" }}
        </td>
      </ng-container>
      <ng-container matColumnDef="productName">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by product"
        >
          ProductName
        </th>
        <td mat-cell *matCellDef="let sale">{{ sale.productName }}</td>
      </ng-container>
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let sale">{{ sale.price }}</td>
      </ng-container>

      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Quantity</th>
        <td mat-cell *matCellDef="let sale">{{ sale.quantity }}</td>
      </ng-container>

      <ng-container matColumnDef="totalPrice">
        <th mat-header-cell *matHeaderCellDef>TotalPrice</th>
        <td mat-cell *matCellDef="let sale">
          {{ sale.price * sale.quantity }}
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

      <th mat-header-row *matHeaderRowDef="displayedColumns"></th>
      <td mat-row *matRowDef="let row; columns: displayedColumns"></td>
    </table>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleListComponent {
  @Input() sales: SaleModel[] = [
    {
      id: 1,
      sellingDate: "04-05-2024",
      createDate: "04-05-2024",
      updateDate: "04-05-2024",
      productId: 18,
      productName: "belt",
      description: "1 belt",
      isDeleted: false,
      price: 100,
      quantity: 2,
    },
    {
      id: 1,
      sellingDate: "02-05-2024",
      createDate: "05-05-2024",
      updateDate: "06-05-2024",
      productId: 16,
      productName: "pencil box",
      description: "3 pencil box",
      isDeleted: false,
      price: 50,
      quantity: 3,
    },
  ];
  @Output() edit = new EventEmitter<SaleModel>();
  @Output() delete = new EventEmitter<SaleModel>();
  @Output() sort = new EventEmitter<{
    sortColumn: string;
    sortDirection: "asc" | "desc";
  }>();

  displayedColumns = [
    "sellingDate",
    "productName",
    "price",
    "quantity",
    "totalPrice",
    "action",
  ];

  onSortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
