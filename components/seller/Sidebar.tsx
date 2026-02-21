"use client";

import { NavItems } from "./NavItems";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Sidebar() {
  return (
    <>
      <aside className="hidden md:flex w-64 flex-col border-r min-h-screen bg-background p-6 sticky top-0 self-start">
        <div className="flex items-center gap-2 mb-10 px-2">
          <Link href="/">
            <h1 className="font-bold text-3xl">
              Next<span className="text-special">Tech</span>
            </h1>
          </Link>
        </div>

        <NavItems />

        <div className="mt-auto p-4 rounded-3xl bg-muted/20 border border-dashed border-muted-foreground/20 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            Need help with your store?
          </p>
          <Button
            variant="link"
            className="text-xs text-rose-500 h-auto p-0 mt-1"
          >
            Contact Support
          </Button>
        </div>
      </aside>
    </>
  );
}
