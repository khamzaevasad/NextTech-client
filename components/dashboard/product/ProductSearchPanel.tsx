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

interface ProductSearchPanelProps {
  onSearch: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function ProductSearchPanel({
  onSearch,
  onStatusChange,
}: ProductSearchPanelProps) {
  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-9 rounded-xl"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <Select onValueChange={onStatusChange} defaultValue="ACTIVE">
        <SelectTrigger className="w-32 rounded-xl">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="PAUSE">Pause</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
