import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CategoryModel } from "../category.model";

@Component({
  selector: "app-category-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  standalone: true,
  styles: [``],
  template: `
    <table
      style=" margin-top: 1.5rem;"
      mat-table
      [dataSource]="categories"
      class="mat-elevation-z8"
    >
      <ng-container matColumnDef="categoryName">
        <th mat-header-cell *matHeaderCellDef>Category</th>
        <td mat-cell *matCellDef="let element">{{ element.categoryName }}</td>
      </ng-container>

      <ng-container matColumnDef="createDate">
        <th mat-header-cell *matHeaderCellDef>Create Date</th>
        <td mat-cell *matCellDef="let element">{{ element.createDate }}</td>
      </ng-container>

      <ng-container matColumnDef="updateDate">
        <th mat-header-cell *matHeaderCellDef>Update Date</th>
        <td mat-cell *matCellDef="let element">{{ element.updateDate }}</td>
      </ng-container>

      <ng-container matColumnDef="action">
        <th mat-header-cell *matHeaderCellDef>Action</th>
        <td mat-cell *matCellDef="let element">
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
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class CategoryListComponent {
  @Input({ required: true }) categories!: CategoryModel[];
  @Output() edit = new EventEmitter<CategoryModel>();
  @Output() delete = new EventEmitter<CategoryModel>();
  displayedColumns: string[] = [
    "createDate",
    "updateDate",
    "categoryName",
    "action",
  ];
}
