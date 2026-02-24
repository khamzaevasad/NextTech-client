"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NoticeSearchPanelProps {
  onStatusChange: (value: string) => void;
}

export function NoticeSearchPanel({ onStatusChange }: NoticeSearchPanelProps) {
  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <Select onValueChange={onStatusChange} defaultValue="ALL">
        <SelectTrigger className="w-36 rounded-xl">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="HOLD">Hold</SelectItem>
          <SelectItem value="DELETE">Deleted</SelectItem>
          <SelectItem value="EVENT">Event</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
