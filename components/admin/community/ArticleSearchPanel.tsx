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

interface ArticlesSearchPanelProps {
  onSearch: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function ArticlesSearchPanel({
  onSearch,
  onStatusChange,
  onCategoryChange,
}: ArticlesSearchPanelProps) {
  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search stores..."
          className="pl-9 rounded-xl"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <Select onValueChange={onStatusChange} defaultValue="ALL">
        <SelectTrigger className="w-32 rounded-xl">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="DELETE">Delete</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onCategoryChange} defaultValue="ALL">
        <SelectTrigger className="hidden md:flex  w-32 rounded-xl">
          <SelectValue placeholder="category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Categories</SelectItem>
          <SelectItem value="FREE">Free</SelectItem>
          <SelectItem value="RECOMMEND">Recommended</SelectItem>
          <SelectItem value="NEWS">News</SelectItem>
          <SelectItem value="HUMOR">Humor</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
