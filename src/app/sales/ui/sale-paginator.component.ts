import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-sale-paginator",
  standalone: true,
  imports: [MatPaginatorModule],
  template: `
    <mat-paginator
      class="product-paginator"
      [length]="totalRecords"
      [pageSize]="5"
      [pageSizeOptions]="[5, 10, 25, 100]"
      aria-label="Select page"
      (page)="onPageSelect($event)"
    >
    </mat-paginator>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalePaginatorComponent {
  @Input({ required: true }) totalRecords!: number;
  @Output() pageSelect = new EventEmitter<{ page: number; limit: number }>();

  onPageSelect(e: PageEvent) {
    this.pageSelect.emit({ page: e.pageIndex + 1, limit: e.pageSize });
  }
}
