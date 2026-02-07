import { TotalCounter } from "../product/product";

export interface Category {
  _id: string;
  categoryName: string;
  categorySlug: string;
  categoryImage?: string;
  categoryDesc?: string;
  parentId?: string | null;
  categoryFilterKeys: string[];
  //   createdAt: Date;
  //   updatedAt: Date;
  children?: Category[] | null;
}
export interface Categories {
  list: Category[];
  metaCounter?: TotalCounter[];
}
