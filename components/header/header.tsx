"use client";
import { useScroll } from "@/hooks/use-scroll";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "../web/theme-toggle";
import Link from "next/link";
import { useQuery, useReactiveVar } from "@apollo/client";
import { authReadyVar, userVar } from "@/apollo/store";
import { logout } from "@/lib/auth";
import { CartDropdown } from "./Cartdropdown";
import { WishlistButton } from "./Wishlistbutton";
import { useState } from "react";
import { ProductsInquiry } from "@/lib/types/product/product.input";
import { Direction } from "@/lib/enums/comment.enum";
import { GET_PRODUCTS } from "@/apollo/user/user-query";

export function Header() {
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const { data: wishListData } = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: "createdAt",
        direction: Direction.DESC,
        search: {},
      },
    },
    fetchPolicy: "cache-first",
  });

  const favoriteProducts = wishListData?.getProducts?.list || [];
  const scrolled = useScroll(10);
  const user = useReactiveVar(userVar);
  const authReady = useReactiveVar(authReadyVar);

  if (!authReady) {
    return null;
  }

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
        "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
          scrolled,
      })}
    >
      <nav className="flex h-14 align-elements items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-3xl">
            Next<span className="text-special">Tech</span>
          </h1>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Home
          </Link>
          <Link
            href="/products"
            className={buttonVariants({ variant: "ghost" })}
          >
            Products
          </Link>
          <Link href="/stores" className={buttonVariants({ variant: "ghost" })}>
            Stores
          </Link>
          <Link
            href="/community"
            className={buttonVariants({ variant: "ghost" })}
          >
            Community
          </Link>
          <Link href="/cs" className={buttonVariants({ variant: "ghost" })}>
            CS
          </Link>
          {user?._id && (
            <Link
              href="/myPage"
              className={buttonVariants({ variant: "ghost" })}
            >
              My Page
            </Link>
          )}
        </div>
        <div className="flex gap-1 items-center">
          <WishlistButton userId={user?._id} />
          <CartDropdown userId={user?._id} />
          <ThemeToggle />
          <div className="hidden items-center gap-1 md:flex">
            {!user?._id ? (
              <>
                <Link
                  href="/auth/sign-up/"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Sign up
                </Link>
                <Link className={buttonVariants({})} href="/auth/login">
                  Login
                </Link>
              </>
            ) : (
              <Button onClick={() => logout()} className="cursor-pointer">
                Logout
              </Button>
            )}
          </div>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
// className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8"
