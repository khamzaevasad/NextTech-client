"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Notice } from "@/lib/types/notice/notice";

interface NoticeViewModalProps {
  open: boolean;
  onClose: () => void;
  notice: Notice | null;
}

export default function NoticeViewModal({
  open,
  onClose,
  notice,
}: NoticeViewModalProps) {
  if (!notice) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="pr-6">{notice.noticeTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant={
                notice.noticeStatus === "ACTIVE" ? "default" : "secondary"
              }
            >
              {notice.noticeStatus}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              {notice.noticeViews ?? 0} views
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(notice.createdAt), "PPP")}
            </span>
          </div>

          <div className="rounded-md bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {notice.noticeContent}
          </div>

          {notice.authorData && (
            <p className="text-xs text-muted-foreground">
              Posted by{" "}
              <span className="font-medium">
                {notice.authorData.memberNick}
              </span>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
