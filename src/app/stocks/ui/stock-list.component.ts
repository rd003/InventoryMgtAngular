import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { StockDisplayModel } from "../stock-display.model";
import { MatSortModule } from "@angular/material/sort";

@Component({
  selector: "app-stock-list",
  standalone: true,
  imports: [MatTableModule, MatSortModule],
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table
      style=" margin-top: 1.5rem;"
      mat-table
      [dataSource]="stocks"
      class="mat-elevation-z8"
    >
      <ng-container matColumnDef="productName">
        <th mat-header-cell *matHeaderCellDef="productName">Product</th>
        <td mat-cell *matCellDef="let item">{{ item.productName }}</td>
      </ng-container>
      <ng-container matColumnDef="categoryName">
        <th mat-header-cell *matHeaderCellDef="categoryName">Category</th>
        <td mat-cell *matCellDef="let item">{{ item.categoryName }}</td>
      </ng-container>

      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef="quantity">Quantity</th>
        <td mat-cell *matCellDef="let item">{{ item.quantity }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class StockListComponent {
  @Input({ required: true }) stocks!: StockDisplayModel[];

  displayedColumns = ["productName", "categoryName", "quantity"];
}
