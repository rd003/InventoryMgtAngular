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
    <app-category-form [categories]="categories" />
  `,
})
export class CategoryComponent implements OnInit {
  ngOnInit() {}
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
}
