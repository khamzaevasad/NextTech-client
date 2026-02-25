"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCartIcon, Trash2, Plus, Minus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { API_URL } from "@/lib/config";
import { useCartStore } from "@/stores/cartStore";

interface CartDropdownProps {
  userId?: string;
}

export function CartDropdown({ userId }: CartDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    cartItems,
    getTotalPrice,
    onDelete,
    onDeleteAll,
    onRemove,
    onAdd,
    getTotalItems,
  } = useCartStore();

  const cartCount = cartItems.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative cursor-pointer"
          size="icon"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-pink-600 hover:bg-pink-600 text-white text-xs font-bold">
              {getTotalItems() > 99 ? "99+" : cartCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Shopping Cart</h3>
          <Badge variant="secondary" className="font-semibold">
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </Badge>
        </div>

        {cartCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <ShoppingCartIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium mb-2">
              Your cart is empty
            </p>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Add some products to get started!
            </p>
            <Link
              href="/products"
              className={cn(
                buttonVariants({}),
                "bg-pink-600 hover:bg-pink-500 text-white",
              )}
              onClick={() => setIsOpen(false)}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                      {item.productImages ? (
                        <Image
                          src={`${API_URL}/${item.productImages}`}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingCartIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        onClick={() => setIsOpen(false)}
                        className="font-medium text-sm line-clamp-2 hover:text-pink-500 transition-colors"
                      >
                        {item.productName}
                      </Link>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-bold text-pink-500">
                          ${item.productPrice.toLocaleString()}
                        </span>
                        {item.productStock === 0 && (
                          <Badge variant="destructive" className="text-xs">
                            Out of stock
                          </Badge>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 cursor-pointer"
                            onClick={() => onRemove(item)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 cursor-pointer"
                            onClick={() => onAdd(item)}
                            disabled={item.quantity >= (item.productStock || 0)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onDelete(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery</span>
                  {getTotalPrice() >= 500 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span>$5</span>
                  )}
                </div>
                {getTotalPrice() < 500 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(500 - getTotalPrice()).toLocaleString()} more for
                    free delivery
                  </p>
                )}
                <Separator />
                <div className="flex items-center justify-between text-base">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg text-pink-500">
                    $
                    {(
                      getTotalPrice() + (getTotalPrice() >= 500 ? 0 : 5)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1 cursor-pointer"
                  onClick={() => onDeleteAll()}
                >
                  Clear
                </Button>
                <Link
                  href="/checkout"
                  className={cn(
                    buttonVariants({}),
                    "flex-1 bg-pink-600 hover:bg-pink-500 text-white text-center",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
