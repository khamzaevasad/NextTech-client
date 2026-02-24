"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FaqSearchPanelProps {
  onCategoryChange: (value: string) => void;
}

export function FaqSearchPanel({ onCategoryChange }: FaqSearchPanelProps) {
  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <Select onValueChange={onCategoryChange} defaultValue="ALL">
        <SelectTrigger className="w-44 rounded-xl">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          <SelectItem value="GENERAL">General</SelectItem>
          <SelectItem value="PAYMENT">Payment</SelectItem>
          <SelectItem value="ACCOUNT">Account</SelectItem>
          <SelectItem value="SERVICE">Service</SelectItem>
          <SelectItem value="SELLER">Seller</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
