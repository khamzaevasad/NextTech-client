import { EmptyState } from "@/components/web/EmptyState";
import { Order } from "@/lib/types/orders/order";
import { ShoppingBag } from "lucide-react";
import { OrderCard } from "./OrderCard";

interface OrderListProps {
  orders: Order[];
  onPayment: (orderId: string) => Promise<void>;
  onComplete: (orderId: string) => Promise<void>;
  paymentLoadingId?: string | null;
  completeLoadingId?: string | null;
  emptyMessage?: string;
}

export function OrderList({
  orders,
  onPayment,
  onComplete,
  paymentLoadingId,
  completeLoadingId,
  emptyMessage = "No orders found",
}: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <EmptyState icon={<ShoppingBag size={40} />} title={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          onPayment={onPayment}
          onComplete={onComplete}
          paymentLoading={paymentLoadingId === order._id}
          completeLoading={completeLoadingId === order._id}
        />
      ))}
    </div>
  );
}
