"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  MessageCircle,
  Package,
  PlusSquare,
  Settings,
  Store,
  UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { MemberType } from "@/lib/enums/member.enum";

const navItems = [
  { label: "ProductList", href: "/dashboard", icon: Package },
  {
    label: "Create Product",
    href: "/dashboard/create-product",
    icon: PlusSquare,
  },
  { label: "Store Settings", href: "/dashboard/settings", icon: Settings },
];

const navItemsAdmin = [
  { label: "UserList", href: "/admin-dashboard", icon: UsersIcon },
  {
    label: "ProductList",
    href: "/admin-dashboard/product-list",
    icon: Package,
  },
  {
    label: "StoreList",
    href: "/admin-dashboard/store-list",
    icon: Store,
  },
  {
    label: "Community",
    href: "/admin-dashboard/community",
    icon: MessageCircle,
  },
  { label: "CS", href: "/admin-dashboard/Cs", icon: Compass },
];

interface NavItemsProps {
  onClose?: () => void;
}

export function NavItems({ onClose }: NavItemsProps) {
  const pathname = usePathname();
  const user = useReactiveVar(userVar);

  return (
    <nav className="flex flex-col gap-2 p-4 md:p-0">
      {user.memberType === MemberType.SELLER ? (
        <>
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
        </>
      ) : (
        <>
          {navItemsAdmin.map((item) => {
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
        </>
      )}
    </nav>
  );
}
