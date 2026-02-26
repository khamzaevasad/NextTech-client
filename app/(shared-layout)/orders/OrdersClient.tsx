"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LoadingBar } from "@/components/web/LoadingBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Package,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Order } from "@/lib/types/orders/order";
import { OrderStatus } from "@/lib/enums/order.enum";
import { OrderItemInput } from "@/lib/types/orders/order.input";
import { useCartStore } from "@/stores/cartStore";
import { GET_MY_ORDERS } from "@/apollo/user/user-query";
import { CREATE_ORDER, UPDATE_ORDER } from "@/apollo/user/user-mutation";
import { OrderList } from "@/components/order/OrderList";
import { CheckoutModal } from "@/components/order/CheckoutModal";
import { AuthGuard } from "@/app/auth/AuthGuard";

const LIMIT = 8;

type OrderTab = "PAUSE" | "PROCESS" | "FINISH";

const TABS: { value: OrderTab; label: string; icon: React.ReactNode }[] = [
  { value: "PAUSE", label: "Awaiting", icon: <Clock className="w-4 h-4" /> },
  {
    value: "PROCESS",
    label: "In Delivery",
    icon: <Package className="w-4 h-4" />,
  },
  {
    value: "FINISH",
    label: "Delivered",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>("PAUSE");
  const [page, setPage] = useState(1);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);
  const [completeLoadingId, setCompleteLoadingId] = useState<string | null>(
    null,
  );

  /* ─── Cart store ─────────────────────────────────────────────────────────── */
  const { cartItems, onDeleteAll } = useCartStore();

  /* -------------------------------------------------------------------------- */
  /*                               APOLLO CLIENT                                */
  /* -------------------------------------------------------------------------- */

  const {
    data: ordersData,
    loading: ordersLoading,
    refetch: ordersRefetch,
  } = useQuery(GET_MY_ORDERS, {
    variables: {
      input: {
        page,
        limit: LIMIT,
        search: { orderStatus: activeTab as OrderStatus },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const [createOrder, { loading: createLoading }] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      toast.success("Order placed! Proceed to payment.");
      onDeleteAll();
      setCheckoutOpen(false);
      setActiveTab("PAUSE");
      ordersRefetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const [updateOrder] = useMutation(UPDATE_ORDER, {
    onCompleted: () => ordersRefetch(),
    onError: (err) => toast.error(err.message),
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const orders: Order[] = ordersData?.getMyOrders?.list || [];
  const totalCount =
    ordersData?.getMyOrders?.metaCounter?.[0]?.total || orders.length;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as OrderTab);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCheckoutSubmit = async (
    orderItems: OrderItemInput[],
    deliveryAddress: { fullName: string; phone: string; address: string },
  ) => {
    await createOrder({
      variables: { input: { orderItems, deliveryAddress } },
    });
  };

  // PAUSE → PROCESS
  const handlePayment = async (orderId: string) => {
    setPaymentLoadingId(orderId);
    try {
      await updateOrder({
        variables: { input: { orderId, orderStatus: OrderStatus.PROCESS } },
      });
      toast.success("Payment confirmed! Your order is on its way.");
      setActiveTab("PROCESS");
    } finally {
      setPaymentLoadingId(null);
    }
  };

  // PROCESS → FINISH
  const handleComplete = async (orderId: string) => {
    setCompleteLoadingId(orderId);
    try {
      await updateOrder({
        variables: { input: { orderId, orderStatus: OrderStatus.FINISH } },
      });
      toast.success("Order marked as completed!");
      ordersRefetch();
    } finally {
      setCompleteLoadingId(null);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <AuthGuard>
        <LoadingBar loading={ordersLoading} />
        <div className="my-8 space-y-6 animate-in fade-in duration-500 min-h-screen">
          {/* Header */}
          <div className="border-b">
            <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
              <h1 className="text-4xl font-bold mb-2">My Orders</h1>
              <p className="text-muted-foreground">
                Review your purchases, order details, and shipping progress
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList variant={"line"} className="w-full sm:w-auto ">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 sm:flex-none gap-2 cursor-pointer"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-4">
                <OrderList
                  orders={orders}
                  onPayment={handlePayment}
                  onComplete={handleComplete}
                  paymentLoadingId={paymentLoadingId}
                  completeLoadingId={completeLoadingId}
                  emptyMessage={
                    tab.value === "PAUSE"
                      ? "No pending orders"
                      : tab.value === "PROCESS"
                        ? "No orders in delivery"
                        : "No completed orders yet"
                  }
                />
              </TabsContent>
            ))}
          </Tabs>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  className={cn(
                    "w-10 h-10",
                    page === p && "bg-pink-500 hover:bg-pink-600",
                  )}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Checkout Modal */}
        <CheckoutModal
          key={`checkout-${checkoutOpen}`}
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cartItems={cartItems}
          onSubmit={handleCheckoutSubmit}
          loading={createLoading}
        />
      </AuthGuard>
    </>
  );
}
