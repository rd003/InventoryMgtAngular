import { PaginationModel } from "../shared/models/pagination.model";

export interface StockDisplayModel {
  categoryName: string;
  productName: string;
  productId: number;
  quantity: number;
  id: number;
  createDate: string;
  updateDate: string;
  isDeleted: boolean;
}

export interface PaginatedStocks extends PaginationModel {
  stocks: StockDisplayModel[];
}
