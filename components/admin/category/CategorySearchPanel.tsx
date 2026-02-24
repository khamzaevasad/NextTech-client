"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Category } from "@/lib/types/category/category";

interface CategorySearchPanelProps {
  parentCategories: Category[];
  onSearch: (value: string) => void;
  onParentChange: (value: string) => void;
}

export function CategorySearchPanel({
  parentCategories,
  onSearch,
  onParentChange,
}: CategorySearchPanelProps) {
  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-9 rounded-xl"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <Select onValueChange={onParentChange} defaultValue="ALL">
        <SelectTrigger className="w-40 rounded-xl">
          <SelectValue placeholder="Parent" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="NULL">Root only</SelectItem>
          {parentCategories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.categoryName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
