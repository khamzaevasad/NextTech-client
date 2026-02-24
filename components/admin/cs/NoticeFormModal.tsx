"use client";

import { useState } from "react";
import { Notice } from "@/lib/types/notice/notice";
import { NoticeStatus } from "@/lib/enums/notice.enum";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface NoticeFormModalProps {
  open: boolean;
  notice: Notice | null;
  onClose: () => void;
  onSubmit: (input: Record<string, unknown>) => void;
}

export function NoticeFormModal({
  open,
  notice,
  onClose,
  onSubmit,
}: NoticeFormModalProps) {
  const isEdit = !!notice;

  const [noticeTitle, setNoticeTitle] = useState(notice?.noticeTitle ?? "");
  const [noticeContent, setNoticeContent] = useState(
    notice?.noticeContent ?? "",
  );
  const [noticeStatus, setNoticeStatus] = useState<NoticeStatus>(
    notice?.noticeStatus ?? NoticeStatus.ACTIVE,
  );

  const handleSubmit = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      toast.error("Title and content are required");
      return;
    }
    if (isEdit) {
      onSubmit({ noticeTitle, noticeContent, noticeStatus });
    } else {
      onSubmit({ noticeTitle, noticeContent });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Notice" : "Create Notice"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="noticeTitle">Title</Label>
            <Input
              id="noticeTitle"
              placeholder="Enter notice title"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="noticeContent">Content</Label>
            <Textarea
              id="noticeContent"
              placeholder="Enter notice content"
              rows={5}
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
            />
          </div>

          {isEdit && (
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={noticeStatus}
                onValueChange={(val) => setNoticeStatus(val as NoticeStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NoticeStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={NoticeStatus.HOLD}>Hold</SelectItem>
                  <SelectItem value={NoticeStatus.EVENT}>Event</SelectItem>
                  <SelectItem value={NoticeStatus.DELETE}>Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-pink-500 hover:bg-pink-600 text-white"
            onClick={handleSubmit}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
