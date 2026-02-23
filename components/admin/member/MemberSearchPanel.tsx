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

interface MemberSearchPanelProps {
  onSearch: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMemberTypeChange: (value: string) => void;
}

export function MemberSearchPanel({
  onSearch,
  onStatusChange,
  onMemberTypeChange,
}: MemberSearchPanelProps) {
  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
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
          <SelectItem value="BLOCK">Block</SelectItem>
          <SelectItem value="DELETE">Delete</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onMemberTypeChange} defaultValue="ALL">
        <SelectTrigger className="w-32 rounded-xl">
          <SelectValue placeholder="MemberType" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Users</SelectItem>
          <SelectItem value="SELLER">Sellers</SelectItem>
          <SelectItem value="CUSTOMER">Customers</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
