"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  userId?: string;
  className?: string;
}

// Mock query - replace with your actual GraphQL query
const GET_WISHLIST_COUNT = `
  query GetWishlistCount {
    getWishlistCount
  }
`;

export function WishlistButton({ userId, className }: WishlistButtonProps) {
  // Replace this with your actual Apollo query
  // const { data, loading } = useQuery(GET_WISHLIST_COUNT, {
  //   skip: !userId,
  //   fetchPolicy: "cache-and-network",
  // });

  // Mock count - replace with actual data from query
  // const wishlistCount = data?.getWishlistCount || 0;
  const wishlistCount = 0; // Remove this line when using real query

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
