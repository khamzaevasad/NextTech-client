import { StoreLocation } from "@/lib/enums/store.enum";

export interface StoreInput {
  ownerId?: string;
  storeName: string;
  storeDesc?: string;
  storeLogo?: string;
  storePhone: string;
  storeAddress: string;
  storeLocation: StoreLocation;
}

/**Inquiry**/
interface SearchStore {
  text?: string;
}

export interface StoresInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: SearchStore;
}
