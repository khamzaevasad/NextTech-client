"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GridPattern } from "@/components/ui/grid-pattern";
import { ChevronRight } from "lucide-react";

interface CommunitySidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "FREE", label: "Free Board", desc: "Talk about anything" },
  { id: "RECOMMEND", label: "Recommendation", desc: "Best tools and tips" },
  { id: "NEWS", label: "News", desc: "Latest tech updates" },
  { id: "HUMOR", label: "Humor", desc: "Dev jokes & memes" },
];

export default function CommunitySidebar({
  activeCategory,
  onCategoryChange,
}: CommunitySidebarProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="sticky top-4 space-y-px border-x border-y bg-border shadow-sm rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="relative overflow-hidden bg-background p-6">
          {/* MagicUI Grid Pattern */}
          <div className="mask-[radial-gradient(farthest-side_at_top,white,transparent)] pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full opacity-50">
            <GridPattern
              className="absolute inset-0 size-full stroke-border"
              height={20}
              width={20}
              x={-12}
              y={4}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 border-4 border-background shadow-md mb-4">
              <AvatarImage src="/icon.png" alt="logo" />
              <AvatarFallback className="bg-pink-500 text-white text-xl font-bold">
                NT
              </AvatarFallback>
            </Avatar>
            <h1 className="font-bold text-2xl tracking-tight text-foreground">
              Next<span className="text-pink-500">Tech</span>
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mt-1">
              Community Hub
            </p>
          </div>
        </div>

        {/* category list */}
        <nav className="bg-background overflow-hidden">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "relative w-full text-left p-4 transition-all duration-200 flex items-center justify-between group border-b last:border-b-0",
                  isActive ? "bg-rose-50/50" : "hover:bg-muted/50",
                )}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500" />
                )}

                <div className="relative z-10">
                  <span
                    className={cn(
                      "block text-sm font-semibold transition-colors",
                      isActive ? "text-pink-600" : "text-foreground",
                    )}
                  >
                    {category.label}
                  </span>
                  <span className="block text-[11px] text-muted-foreground font-light">
                    {category.desc}
                  </span>
                </div>

                <ChevronRight
                  className={cn(
                    "size-4 transition-transform duration-200",
                    isActive
                      ? "text-pink-500 translate-x-1"
                      : "text-muted-foreground group-hover:translate-x-1",
                  )}
                />
              </button>
            );
          })}
        </nav>

        <div className="p-4 bg-muted/20 text-center">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            © 2026 NEXTTECH COMMUNITY
          </p>
        </div>
      </div>
    </aside>
  );
}
