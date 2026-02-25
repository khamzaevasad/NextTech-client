import { OrderStatus } from "@/lib/enums/order.enum";
import { Product, TotalCounter } from "../product/product";

/* ------------------------------- Order Items ------------------------------ */
export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  orderId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

/* ----------------------------- DeliveryAddress ----------------------------- */

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
}

/* ---------------------------------- Order --------------------------------- */
export interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  deliveryAddress: DeliveryAddress;
  orderStatus: OrderStatus;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  /* ---------------------------- FROM AGGREGATION ---------------------------- */
  orderItems?: OrderItem[];
  productData?: Product[];
}

/* -------------------------------- Orders ---------------------------------- */

export interface Orders {
  list: Order[];
  metaCounter?: TotalCounter[];
}
export interface OrderItems {
  list: OrderItem[];
  metaCounter?: TotalCounter[];
}
