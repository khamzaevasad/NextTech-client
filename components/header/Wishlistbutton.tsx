"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductsInquiry } from "@/lib/types/product/product.input";
import { useState } from "react";
import { Direction } from "@/lib/enums/comment.enum";
import { GET_PRODUCTS } from "@/apollo/user/user-query";
import { Product } from "@/lib/types/product/product";

interface WishlistButtonProps {
  userId?: string;
  className?: string;
}

export function WishlistButton({ userId, className }: WishlistButtonProps) {
  const wishlistCount = 0;

  return (
    <Link
      href="/wishlist"
      className={cn(
        buttonVariants({ variant: "outline" }),
        "relative",
        className,
      )}
    >
      <Heart className="h-5 w-5" />
      {wishlistCount > 0 && (
        <Badge
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-pink-600 hover:bg-pink-600 text-white text-xs font-bold"
          variant="destructive"
        >
          {wishlistCount > 99 ? "99+" : wishlistCount}
        </Badge>
      )}
    </Link>
  );
}
