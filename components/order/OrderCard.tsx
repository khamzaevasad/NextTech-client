"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  CreditCard,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { OrderStatus } from "@/lib/enums/order.enum";
import { API_URL } from "@/lib/config";
import Image from "next/image";
import { format } from "date-fns";
import { Order } from "@/lib/types/orders/order";
import { PaymentModal } from "./PaymentModal";
import Link from "next/link";

interface OrderCardProps {
  order: Order;
  onPayment: (orderId: string) => Promise<void>;
  onComplete: (orderId: string) => Promise<void>;
  paymentLoading?: boolean;
  completeLoading?: boolean;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  [OrderStatus.PAUSE]: {
    label: "Awaiting Payment",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  [OrderStatus.PROCESS]: {
    label: "In Delivery",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Package className="w-3.5 h-3.5" />,
  },
  [OrderStatus.FINISH]: {
    label: "Delivered",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  [OrderStatus.DELETE]: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: null,
  },
};

export function OrderCard({
  order,
  onPayment,
  onComplete,
  paymentLoading,
  completeLoading,
}: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const status = STATUS_CONFIG[order.orderStatus];

  const handlePaymentSuccess = async () => {
    await onPayment(order._id);
    setPaymentOpen(false);
  };

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono">
              #{order._id.slice(-8).toUpperCase()}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}
            >
              {status.icon}
              {status.label}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {format(new Date(order.createdAt), "MMM d, yyyy · HH:mm")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-bold text-pink-500">
                ${order.orderTotal.toLocaleString()}
              </p>
            </div>

            {order.orderStatus === OrderStatus.PAUSE && (
              <Button
                size="sm"
                className="bg-pink-500 hover:bg-pink-600 text-white gap-1.5 cursor-pointer"
                onClick={() => setPaymentOpen(true)}
                disabled={paymentLoading}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Pay Now
              </Button>
            )}

            {order.orderStatus === OrderStatus.PROCESS && (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white gap-1.5 cursor-pointer"
                onClick={() => onComplete(order._id)}
                disabled={completeLoading}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4 cursor-pointer" />
              ) : (
                <ChevronDown className="w-4 h-4 cursor-pointer" />
              )}
            </Button>
          </div>
        </div>

        {/* Expandable content */}
        {expanded && (
          <>
            <Separator />

            {/* Product items */}
            {order.productData && order.productData.length > 0 && (
              <div className="p-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Items
                </p>
                <div className="space-y-2">
                  {order.productData.map((product, idx) => {
                    const orderItem = order.orderItems?.[idx];
                    return (
                      <div
                        key={product._id}
                        className="flex items-center gap-3"
                      >
                        <div className="relative size-12 rounded-md border overflow-hidden bg-muted shrink-0">
                          {product.productImages?.[0] ? (
                            <Image
                              src={`${API_URL}/${product.productImages[0]}`}
                              alt={product.productName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${product.productSlug}`}
                            className="text-sm font-medium truncate"
                          >
                            {product.productName}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {orderItem?.itemQuantity ?? 1} × $
                            {product.productPrice.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm font-semibold shrink-0">
                          $
                          {(
                            product.productPrice *
                            (orderItem?.itemQuantity ?? 1)
                          ).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            {/* Delivery address  */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* deliveryAddress optional */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Delivery Address
                </p>
                {order.deliveryAddress ? (
                  <>
                    <p className="text-sm font-medium">
                      {order.deliveryAddress.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.deliveryAddress.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.deliveryAddress.address}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Pricing
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      $
                      {(
                        order.orderTotal - order.orderDelivery
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>
                      {order.orderDelivery === 0
                        ? "Free"
                        : `$${order.orderDelivery.toLocaleString()}`}
                    </span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-pink-500">
                      ${order.orderTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <PaymentModal
        key={`payment-${paymentOpen}-${order._id}`}
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        orderId={order._id}
        orderTotal={order.orderTotal}
        onSuccess={handlePaymentSuccess}
        loading={paymentLoading}
      />
    </>
  );
}
