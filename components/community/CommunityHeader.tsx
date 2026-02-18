"use client";

import { userVar } from "@/apollo/store";
import { buttonVariants } from "@/components/ui/button";
import { useReactiveVar } from "@apollo/client";
import { PenLineIcon } from "lucide-react";
import Link from "next/link";

interface CommunityHeaderProps {
  activeCategory: string;
}

// Category title mapping
const categoryTitles: Record<string, string> = {
  FREE: "FREE BOARD",
  RECOMMEND: "RECOMMEND BOARD",
  NEWS: "NEWS BOARD",
  HUMOR: "HUMOR BOARD",
};

export default function CommunityHeader({
  activeCategory,
}: CommunityHeaderProps) {
  const user = useReactiveVar(userVar);

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {categoryTitles[activeCategory] || "COMMUNITY BOARD"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Express your opinions freely here without content restrictions
            </p>
          </div>
          {user._id && (
            <Link
              href={"/article"}
              className={buttonVariants({ variant: "ghost" })}
            >
              <PenLineIcon /> Write Article
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
