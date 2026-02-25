"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { OrderItemInput } from "@/lib/types/orders/order.input";
import { toast } from "sonner";
import { LoadingBar } from "@/components/web/LoadingBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_URL } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ShoppingBag,
  ChevronLeft,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { CREATE_ORDER } from "@/apollo/user/user-mutation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, onDeleteAll, getTotalPrice, getTotalItems } =
    useCartStore();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const subtotal = getTotalPrice();
  const delivery = subtotal < 500 ? 5 : 0;
  const total = subtotal + delivery;

  const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      toast.success("Order placed! Proceed to payment.");
      onDeleteAll();
      router.push("/orders");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = async () => {
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all delivery fields");
      return;
    }

    const orderItems: OrderItemInput[] = cartItems.map((item) => ({
      productId: item._id,
      itemQuantity: item.quantity,
    }));

    await createOrder({
      variables: {
        input: {
          orderItems,
          deliveryAddress: { fullName, phone, address },
        },
      },
    });
  };

  /* ─── Empty cart ──────────────────────────────────────────────────────────── */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <ShoppingCart className="w-16 h-16 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm">
          Add products to your cart before checking out
        </p>
        <Link href="/products">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white mt-2">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <LoadingBar loading={loading} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── LEFT: Delivery address ──────────────────────────────────────── */}
          <div>
            <div className="rounded-lg border bg-card p-6 space-y-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-pink-500" />
                <h2 className="font-semibold text-lg">Delivery Address</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address">
                    Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="Seoul, Gangnam-gu..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order summary ─────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-pink-500" />
                <h2 className="font-semibold text-lg">Order Summary</h2>
                <span className="text-sm text-muted-foreground ml-auto">
                  {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Product list */}
              <ScrollArea className="max-h-[320px] pr-1">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="relative size-14 rounded-md border overflow-hidden bg-muted shrink-0">
                        {item.productImages ? (
                          <Image
                            src={`${API_URL}/${item.productImages}`}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × $
                          {item.productPrice.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">
                        ${(item.productPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery</span>
                  {delivery === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span>${delivery}</span>
                  )}
                </div>
                {delivery > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free delivery on orders over $500
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-pink-500">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white h-11 text-base cursor-pointer"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
