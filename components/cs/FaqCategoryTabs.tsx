"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FaqCategory = "GENERAL" | "PAYMENT" | "ACCOUNT" | "SERVICE" | "SELLER";

const FAQ_CATEGORIES: { label: string; value: FaqCategory }[] = [
  { label: "General", value: "GENERAL" },
  { label: "Payment", value: "PAYMENT" },
  { label: "Account", value: "ACCOUNT" },
  { label: "Service", value: "SERVICE" },
  { label: "Seller", value: "SELLER" },
];

interface FaqCategoryTabsProps {
  activeCategory: FaqCategory;
  onCategoryChange: (category: FaqCategory) => void;
}

export function FaqCategoryTabs({
  activeCategory,
  onCategoryChange,
}: FaqCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FAQ_CATEGORIES.map((category) => (
        <Button
          key={category.value}
          variant={activeCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            activeCategory === category.value
              ? "bg-pink-500 hover:bg-pink-600 cursor-pointer"
              : "cursor-pointer",
          )}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
