import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CategoryModel } from "../category.model";
import { NgFor } from "@angular/common";
@Component({
  selector: "app-category-form",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    NgFor,
  ],
  standalone: true,
  styles: [``],
  template: `
    <form
      style="display: inline-flex;gap:10px;align-items:center"
      class="category-form"
      [formGroup]="categoryForm"
      (ngSubmit)="onPost($event)"
    >
      <input type="hidden" formControlName="id" />

      <mat-form-field appearance="outline" style="width: 400px;">
        <mat-label>CategoryName</mat-label>
        <input
          matInput
          placeholder="Category Name"
          formControlName="categoryName"
        />
      </mat-form-field>
      <mat-form-field style="width: 400px;">
        <mat-label>Parent Category</mat-label>
        <mat-select formControlName="categoryId">
          <mat-option value="null">None</mat-option>
          <mat-option
            *ngFor="let category of categories; trackBy: trackById"
            [value]="category.id"
            >{{ category.categoryName }}</mat-option
          >
        </mat-select>
      </mat-form-field>
      <button
        mat-raised-button
        color="primary"
        [disabled]="categoryForm.invalid"
      >
        Save
      </button>

      <button
        type="button"
        mat-raised-button
        color="accent"
        (click)="onReset()"
      >
        Reset
      </button>
    </form>
  `,
})
export class CategoryFormComponent {
  private fb = inject(FormBuilder);

  @Input({ required: true }) set updateFormData(
    category: CategoryModel | null
  ) {
    if (category) this.categoryForm.patchValue(category);
  }
  @Input({ required: true }) categories!: CategoryModel[];
  @Output() submit = new EventEmitter<CategoryModel>();
  @Output() reset = new EventEmitter();

  categoryForm: FormGroup = this.fb.group({
    id: [0],
    categoryName: ["", Validators.required],
    categoryId: [0],
  });

  onPost(event: Event) {
    event.stopPropagation();
    const category = Object.assign(this.categoryForm.value);
    this.submit.emit(category);
    this.categoryForm.reset();
  }

  onReset() {
    this.categoryForm.reset();
    this.reset.emit();
  }

  trackById = (index: number, category: CategoryModel) => category.id;
}
