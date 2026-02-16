"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  userId?: string;
  className?: string;
}

export function WishlistButton({ className }: WishlistButtonProps) {
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
    </Link>
  );
}
