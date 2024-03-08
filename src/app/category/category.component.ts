import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { CategoryFormComponent } from "./ui/category-form.component";
import { CategoryListComponent } from "./ui/category-list.component";
import { CategoryModel } from "./category.model";
import { provideComponentStore } from "@ngrx/component-store";
import { CategoryStore } from "./ui/category.store";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-category",
  standalone: true,
  imports: [
    CategoryFormComponent,
    CategoryListComponent,
    AsyncPipe,
    NgIf,
    NgFor,
    MatProgressSpinnerModule,
  ],
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(CategoryStore)],
  template: `
    <h1>Categories</h1>

    <ng-container *ngIf="vm$ | async as vm" style="position: relative;">
      <div *ngIf="vm.loading" class="spinner-center">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <ng-container *ngIf="vm$ | async as vm">
        <ng-container *ngIf="vm.error; else noError">
          {{ vm.error }}
        </ng-container>
        <ng-template #noError>
          <app-category-form
            [categories]="vm.categories"
            [updateFormData]="categoryToUpdate"
            (submit)="onSubmit($event)"
            (reset)="onReset()"
          />
          <ng-container *ngIf="vm.categories">
            <app-category-list
              [categories]="vm.categories"
              (edit)="onEdit($event)"
              (delete)="onDelete($event)"
            />
          </ng-container>
        </ng-template>
      </ng-container>
    </ng-container>
  `,
})
export class CategoryComponent implements OnInit {
  categoryStore = inject(CategoryStore);
  vm$ = this.categoryStore.vm$;
  categoryToUpdate: CategoryModel | null = null;

  onSubmit(category: CategoryModel) {
    if (category.id == 0) this.categoryStore.saveCategory(category);
    else this.categoryStore.updateCategory(category);

    this.categoryToUpdate = null;
  }
  onReset() {
    this.categoryToUpdate = null;
  }

  onEdit(category: CategoryModel) {
    this.categoryToUpdate = category;
  }

  onDelete(category: CategoryModel) {
    if (confirm("Are you sure?")) {
      this.categoryStore.deleteCategory(category.id);
    }
  }

  ngOnInit() {}
}
