import { StoreLocation, StoreStatus } from "@/lib/enums/store.enum";
import { MeLiked, TotalCounter } from "../product/product";
import { Member } from "../member/member";

export interface _Store {
  _id: string;
  storeName: string;
  ownerId: string;
  storeDesc: string;
  storeStatus: StoreStatus;
  storeAddress: StoreLocation;
  storeProductsCount: number;
  storeLogo: string;
  storeRating: number;
  storeComments: number;
  storeViews: number;
  storeLikes: number;
  storePhone: string;
  /* ---------------------------- FROM AGGREGATION ---------------------------- */
  ownerData?: Member;
  meLiked?: MeLiked[];
}

export interface Stores {
  list: _Store[];
  metaCounter?: TotalCounter[];
}
