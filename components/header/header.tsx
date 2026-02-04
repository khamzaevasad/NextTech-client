"use client";
import { useScroll } from "@/hooks/use-scroll";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "../web/theme-toggle";
import Link from "next/link";

export const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Stores",
    href: "/stores",
  },
  {
    label: "Community",
    href: "/community",
  },
  {
    label: "CS",
    href: "/cs",
  },
];

export function Header() {
  const scrolled = useScroll(10);

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
          {navLinks.map((link, i) => (
            <a
              className={buttonVariants({ variant: "ghost" })}
              href={link.href}
              key={i}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex gap-1">
          <ThemeToggle />
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href="/auth/sign-up/"
              className={buttonVariants({ variant: "outline" })}
            >
              Sign up
            </Link>
            <Link className={buttonVariants({})} href="/auth/login">
              Login
            </Link>
          </div>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
// className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8"
