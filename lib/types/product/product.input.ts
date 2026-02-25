import { Direction, Interface } from "readline";

interface PriceRange {
  start: number;
  end: number;
}
export interface SpecFilterInput {
  key: string;
  values: string[];
}
export interface SearchProduct {
  storeId?: string;
  categoryId?: string;
  categoryIds?: string[];
  priceRange?: PriceRange;
  specs?: SpecFilterInput[];
  brands?: string[];
  text?: string;
}

export interface ProductsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: "ASC" | "DESC";
  search: SearchProduct;
  onlyMyWishlist?: boolean;
}

export interface OrdinaryInquiry {
  page: number;
  limit: number;
}
