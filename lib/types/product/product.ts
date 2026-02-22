/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductStatus } from "@/lib/enums/product.enum";
import { _Store } from "../store/store";

export interface MeLiked {
  memberId: string;
  likeRefId: string;
  myFavorite: boolean;
}
export interface Product {
  _id: string;
  productName: string;

  productSlug: string;

  productDesc: string;

  productBrand: string;

  productPrice: number;

  productStock: number;

  productStatus: ProductStatus;

  productCategory: string;

  storeId: string;

  productSpecsKeys?: string[];

  productSpecs?: Record<string, any>;

  productImages: string[];

  productViews: number;

  productLikes: number;

  productComments: number;

  productRating: number;

  productRatingCount: number;

  createdAt: Date;

  updatedAt: Date;

  /* ---------------------------- FROM AGGREGATION ---------------------------- */
  storeData?: _Store;

  meLiked?: MeLiked[];
}

export interface Products {
  list: Product[];
  metaCounter: TotalCounter[];
}

export interface TotalCounter {
  total: number;
}

export type ProductSpecs = Record<string, any>;
