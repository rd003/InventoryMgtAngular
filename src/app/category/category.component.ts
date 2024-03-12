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
import { NotificationService } from "../shared/notification.service";
import { CategoryFilterComponent } from "./ui/category-filter.component";

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
    CategoryFilterComponent,
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
        <!-- <ng-container *ngIf="vm.error; else noError">
          {{ vm.error }} 
        </ng-container>-->
        <app-category-form
          [categories]="vm.categories"
          [updateFormData]="categoryToUpdate"
          (submit)="onSubmit($event)"
          (reset)="onReset()"
        />
        <app-category-filter (filter)="onFilter($event)" />

        <app-category-list
          *ngIf="vm.categories && vm.categories.length > 0; else noRecords"
          [categories]="vm.categories"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
        />
        <ng-template #noRecords>
          <p style="margin-top:20px;font-size:21px">No records found</p>
        </ng-template>
      </ng-container>
    </ng-container>
  `,
})
export class CategoryComponent implements OnInit {
  categoryStore = inject(CategoryStore);
  notificationService = inject(NotificationService);
  vm$ = this.categoryStore.vm$;
  categoryToUpdate: CategoryModel | null = null;

  onSubmit(category: CategoryModel) {
    if (typeof category.categoryId === "string") category.categoryId = null;
    if (category.id > 0) this.categoryStore.updateCategory(category);
    else {
      category.id = 0;
      this.categoryStore.saveCategory(category);
    }
    this.notificationService.send({
      message: "saved successfully",
      severity: "success",
    });
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
      this.notificationService.send({
        message: "Deleted successfully",
        severity: "success",
      });
    }
  }

  onFilter(searchTerm: string) {
    this.categoryStore.setSearchTerm(searchTerm);
    // console.log(searchTerm);
  }

  ngOnInit() {}
}
