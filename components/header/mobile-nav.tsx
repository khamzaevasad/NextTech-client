"use client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { logout } from "@/lib/auth";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";

export function MobileNav() {
  const user = useReactiveVar(userVar);
  const [open, setOpen] = React.useState(false);
  const { isMobile } = useMediaQuery();

  React.useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  return (
    <>
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open &&
        createPortal(
          <div
            className={cn(
              "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50",
              "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-t md:hidden",
            )}
            id="mobile-menu"
          >
            <div
              className={cn(
                "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
                "size-full p-4",
              )}
              data-slot={open ? "open" : "closed"}
            >
              <div className="grid gap-y-2">
                <Link
                  href="/"
                  className={buttonVariants({
                    variant: "ghost",
                    className: "justify-start",
                  })}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className={buttonVariants({
                    variant: "ghost",
                    className: "justify-start",
                  })}
                >
                  Products
                </Link>
                <Link
                  href="/stores"
                  className={buttonVariants({
                    variant: "ghost",
                    className: "justify-start",
                  })}
                >
                  Stores
                </Link>
                <Link
                  href="/community"
                  className={buttonVariants({
                    variant: "ghost",
                    className: "justify-start",
                  })}
                >
                  Community
                </Link>
                <Link
                  href="/cs"
                  className={buttonVariants({
                    variant: "ghost",
                    className: "justify-start",
                  })}
                >
                  CS
                </Link>
                {user?._id && (
                  <>
                    <Link
                      href="/orders"
                      className={buttonVariants({
                        variant: "ghost",
                        className: "justify-start",
                      })}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/profile/me"
                      className={buttonVariants({
                        variant: "ghost",
                        className: "justify-start",
                      })}
                    >
                      My Page
                    </Link>
                  </>
                )}
              </div>
              <div className="mt-12 flex flex-col gap-2">
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
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
