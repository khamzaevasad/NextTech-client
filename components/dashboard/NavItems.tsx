"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, PlusSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "ProductList", href: "/dashboard", icon: Package },
  {
    label: "Create Product",
    href: "/dashboard/create-product",
    icon: PlusSquare,
  },
  { label: "Store Settings", href: "/dashboard/settings", icon: Settings },
];

interface NavItemsProps {
  onClose?: () => void;
}

export function NavItems({ onClose }: NavItemsProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-4 md:p-0">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
              isActive
                ? "bg-foreground text-background shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
