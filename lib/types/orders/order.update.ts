import { OrderStatus } from "@/lib/enums/order.enum";

export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
