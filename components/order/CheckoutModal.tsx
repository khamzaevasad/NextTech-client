"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/lib/config";
import Image from "next/image";
import { OrderItemInput } from "@/lib/types/orders/order.input";
import { CartItem } from "@/lib/types/common";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onSubmit: (
    orderItems: OrderItemInput[],
    deliveryAddress: { fullName: string; phone: string; address: string },
  ) => Promise<void>;
  loading?: boolean;
}

export function CheckoutModal({
  open,
  onClose,
  cartItems,
  onSubmit,
  loading = false,
}: CheckoutModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.productPrice * item.quantity,
    0,
  );
  const delivery = subtotal > 100000 ? 0 : 3000;
  const total = subtotal + delivery;

  const handleSubmit = async () => {
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all delivery fields");
      return;
    }

    const orderItems: OrderItemInput[] = cartItems.map((item) => ({
      productId: item._id,
      itemQuantity: item.quantity,
    }));

    await onSubmit(orderItems, { fullName, phone, address });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Checkout
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto pr-1">
          <div className="space-y-5 py-2">
            {/* Order summary */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Order Summary
              </p>
              <div className="rounded-lg border divide-y">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 p-3">
                    <div className="relative size-12 rounded-md border overflow-hidden bg-muted shrink-0">
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
                        {item.quantity} × ₩{item.productPrice.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm font-semibold shrink-0">
                      ₩{(item.productPrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 px-1 pt-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₩{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery</span>
                  <span>
                    {delivery === 0 ? "Free" : `₩${delivery.toLocaleString()}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-pink-500">
                    ₩{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">Address</Label>
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
        </ScrollArea>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-pink-500 hover:bg-pink-600 text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
