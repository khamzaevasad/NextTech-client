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
import { CreditCard, Lock, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  orderTotal: number;
  onSuccess: () => Promise<void>;
  loading?: boolean;
}

export function PaymentModal({
  open,
  onClose,
  orderTotal,
  onSuccess,
  loading = false,
}: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
  };

  const handlePay = async () => {
    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      toast.error("Please fill in all card details");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Invalid card number");
      return;
    }

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      await onSuccess();
      toast.success("Payment successful!");
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const isLoading = loading || processing;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Amount */}
          <div className="rounded-lg bg-muted/50 border p-4 text-center">
            <p className="text-sm text-muted-foreground">Amount to pay</p>
            <p className="text-3xl font-bold text-pink-500 mt-1">
              ${orderTotal.toLocaleString()}
            </p>
          </div>

          {/* Card visual */}
          <div className="relative rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 h-40 overflow-hidden">
            <div className="absolute top-4 right-4 opacity-20 text-6xl font-bold">
              ◈
            </div>
            <div className="flex justify-between items-start">
              <CreditCard className="w-8 h-8 opacity-70" />
              <span className="text-xs opacity-50 tracking-widest uppercase">
                {cardNumber.startsWith("4")
                  ? "Visa"
                  : cardNumber.startsWith("5")
                    ? "Mastercard"
                    : "Card"}
              </span>
            </div>
            <p className="mt-4 tracking-[0.25em] text-lg font-mono">
              {cardNumber || "•••• •••• •••• ••••"}
            </p>
            <div className="flex justify-between mt-3">
              <div>
                <p className="text-[10px] opacity-50 uppercase">Cardholder</p>
                <p className="text-sm font-medium uppercase">
                  {cardHolder || "YOUR NAME"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-50 uppercase">Expires</p>
                <p className="text-sm font-medium">{expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>

          {/* Card fields */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value))
                }
                maxLength={19}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cardHolder">Cardholder Name</Label>
              <Input
                id="cardHolder"
                placeholder="John Doe"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                  maxLength={3}
                />
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Your payment info is secure and encrypted</span>
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 ml-auto text-green-500" />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-pink-500 hover:bg-pink-600 text-white cursor-pointer"
            onClick={handlePay}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {processing
              ? "Processing..."
              : `Pay ₩${orderTotal.toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
