import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { debounceTime, tap } from "rxjs";

@Component({
  selector: "app-product-filter",
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  styles: [``],
  template: `
    <mat-form-field appearance="outline" style="width: 400px;">
      <mat-label>Search proudct/category</mat-label>
      <input matInput [formControl]="search" />
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilterComponent {
  search = new FormControl<string>("");
  @Output() filter = new EventEmitter<string | null>();

  constructor() {
    this.search.valueChanges
      .pipe(
        debounceTime(500),
        tap((val) => {
          this.filter.emit(val);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
