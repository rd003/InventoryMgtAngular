import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { CategoryFormComponent } from "./ui/category-form.component";
import { CategoryListComponent } from "./ui/category-list.component";
import { CategoryModel } from "./category.model";

@Component({
  selector: "app-category",
  standalone: true,
  imports: [CategoryFormComponent, CategoryListComponent],
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Categories</h1>
    <app-category-form
      [categories]="categories"
      [updateFormData]="categoryToUpdate"
      (submit)="onSubmit($event)"
      (reset)="onReset()"
    />
    <app-category-list
      [categories]="categories"
      (edit)="onEdit($event)"
      (delete)="onDelete($event)"
    />
  `,
})
export class CategoryComponent implements OnInit {
  categoryToUpdate: CategoryModel | null = null;
  categories: CategoryModel[] = [
    {
      id: 1,
      categoryName: "cat1",
      createDate: "",
      updateDate: "",
      categoryId: null,
    },
    {
      id: 2,
      categoryName: "cat2",
      createDate: "",
      updateDate: "",
      categoryId: null,
    },
  ];

  onSubmit(category: CategoryModel) {
    alert(JSON.stringify(category));
    this.categoryToUpdate = null;
  }
  onReset() {
    this.categoryToUpdate = null;
  }

  onEdit(category: CategoryModel) {
    this.categoryToUpdate = category;
  }

  onDelete(category: CategoryModel) {
    alert(JSON.stringify(category));
  }

  ngOnInit() {}
}
