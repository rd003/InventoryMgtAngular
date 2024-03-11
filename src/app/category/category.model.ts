import { BaseModel } from "../../shared/base-model";

export interface CategoryModel extends BaseModel {
  categoryName: string;
  categoryId?: number | null;
  parentCategoryName: string;
}
