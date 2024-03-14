import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { debounceTime, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-category-filter",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <mat-form-field appearance="outline" style="width: 400px;">
      <mat-label>Search By Category</mat-label>
      <input
        matInput
        placeholder="Search By Category"
        [formControl]="searchTerm"
      />
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        margin-top: 10px;
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFilterComponent {
  searchTerm = new FormControl<string>("");
  @Output() filter = new EventEmitter<string>();
  constructor() {
    this.searchTerm.valueChanges
      .pipe(
        debounceTime(500),
        tap((sTerm) => {
          this.filter.emit(sTerm ?? "");
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
