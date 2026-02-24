"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Notice } from "@/lib/types/notice/notice";
import { NoticeStatus } from "@/lib/enums/notice.enum";
import { useMutation } from "@apollo/client";
import {
  REMOVE_NOTICE_BY_ADMIN,
  UPDATE_NOTICE,
} from "@/apollo/admin/admin-mutation";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState } from "react";

interface NoticeRowProps {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onUpdate: () => void;
}

export function NoticeRow({ notice, onEdit, onUpdate }: NoticeRowProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [updateNotice] = useMutation(UPDATE_NOTICE);
  const [removeNotice] = useMutation(REMOVE_NOTICE_BY_ADMIN);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateNotice({
        variables: {
          input: {
            _id: notice._id,
            noticeStatus: newStatus,
          },
        },
      });
      toast.success(`Status changed to ${newStatus}`);
      onUpdate();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  const onRemove = async (id: string) => {
    try {
      await removeNotice({
        variables: { input: id },
      });

      toast.success("Deleted successfully");
      setDeleteId(null);
      onUpdate();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("onRemove error", err.message);
        toast(err.message);
      } else {
        toast("Unexpected error occurred");
      }
    }
  };

  return (
    <TableRow className="group hover:bg-muted/30 transition-colors">
      {/* TITLE — always visible */}
      <TableCell className="font-semibold py-4 runcate">
        {notice.noticeTitle}
      </TableCell>

      {/* VIEWS */}
      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
        {notice.noticeViews ?? 0}
      </TableCell>

      {/* AUTHOR */}
      <TableCell className="hidden md:table-cell text-muted-foreground text-sm truncate">
        {notice.authorData?.memberNick ?? "—"}
      </TableCell>

      {/* CREATED AT */}
      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
        {format(new Date(notice.createdAt), "MMM d, yyyy")}
      </TableCell>

      {/* STATUS */}
      <TableCell className="hidden md:table-cell">
        <Select
          defaultValue={notice.noticeStatus}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="h-8 w-28 rounded-full text-[10px] font-bold uppercase cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NoticeStatus.ACTIVE}>Active</SelectItem>
            <SelectItem value={NoticeStatus.HOLD}>Hold</SelectItem>
            <SelectItem value={NoticeStatus.EVENT}>Event</SelectItem>
            <SelectItem value={NoticeStatus.DELETE}>Delete</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      {/* ACTIONS — always visible */}
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-rose-50 hover:text-pink-500 cursor-pointer"
          onClick={() => onEdit(notice)}
        >
          <Edit size={16} />
        </Button>

        {notice.noticeStatus === "DELETE" && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-rose-50 hover:text-pink-500 cursor-pointer"
            onClick={() => setDeleteId(notice._id)}
          >
            <Trash size={16} />
          </Button>
        )}
      </TableCell>

      {/* ALERT */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500"
              onClick={() => onRemove(deleteId!)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TableRow>
  );
}
