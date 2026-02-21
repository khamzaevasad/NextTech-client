"use client";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { Store, UserCog } from "lucide-react";
import { ThemeToggle } from "../web/theme-toggle";
import { MemberType } from "@/lib/enums/member.enum";
import MobileSidebar from "./MobileSidebar";
import { useState } from "react";

export function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const user = useReactiveVar(userVar);

  return (
    <header className="h-14 border-b flex items-center justify-between px-6 bg-background">
      <div className="flex items-center gap-2 text-sm font-semibold">
        {user.memberType === MemberType.SELLER ? (
          <div className="flex items-center gap-2">
            <Store size={16} />
            Seller Panel
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserCog size={16} />
            Admin Panel
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground hidden sm:inline">
          Welcome {user?.memberNick}
        </span>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileSidebar open={open} setOpen={setOpen} />
        </div>
      </div>
    </header>
  );
}
