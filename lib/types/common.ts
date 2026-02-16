/* eslint-disable @typescript-eslint/no-explicit-any */
export interface T {
  [key: string]: any;
}

export interface CartItem {
  _id: string;
  productName: string;
  productPrice: number;
  productImages: string;
  productStock: number;
  productSlug: string;
  quantity: number;
}

export interface SortOption {
  label: string;
  value: string;
}
