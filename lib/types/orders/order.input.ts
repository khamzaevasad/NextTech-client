import { OrderStatus } from "@/lib/enums/order.enum";

export interface DeliveryAddressInput {
  fullName: string;
  phone: string;
  address: string;
}
export interface OrderItemInput {
  productId: string;
  itemQuantity: number;
}
export interface CreateOrderInput {
  orderItems: OrderItemInput[];
  deliveryAddress: DeliveryAddressInput;
}

/* -------------------------------------------------------------------------- */
/*                                OrdersInquiry                               */
/* -------------------------------------------------------------------------- */

export interface SearchOrder {
  orderStatus?: OrderStatus;
}
export interface OrdersInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search: SearchOrder;
}
