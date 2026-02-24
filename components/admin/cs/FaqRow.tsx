"use client";

import { TableCell, TableRow } from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Faq } from "@/lib/types/faq/faq";
import { FaqCategory } from "@/lib/enums/faq.enum";
import { useMutation } from "@apollo/client";
import { REMOVE_FAQ_BY_ADMIN, UPDATE_FAQ } from "@/apollo/admin/admin-mutation";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState } from "react";

interface FaqRowProps {
  faq: Faq;
  onEdit: (faq: Faq) => void;
  onUpdate: () => void;
}

const CATEGORY_STYLES: Record<FaqCategory, string> = {
  GENERAL: "bg-slate-100 text-slate-700",
  PAYMENT: "bg-green-100 text-green-700",
  ACCOUNT: "bg-blue-100 text-blue-700",
  SERVICE: "bg-orange-100 text-orange-700",
  SELLER: "bg-purple-100 text-purple-700",
};

export function FaqRow({ faq, onEdit, onUpdate }: FaqRowProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [updateFaq] = useMutation(UPDATE_FAQ);
  const [removeFaq] = useMutation(REMOVE_FAQ_BY_ADMIN);

  const handleToggleActive = async () => {
    try {
      await updateFaq({
        variables: {
          input: {
            _id: faq._id,
            isActive: !faq.isActive,
          },
        },
      });
      toast.success(`FAQ ${!faq.isActive ? "activated" : "deactivated"}`);
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
      await removeFaq({
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
      {/* QUESTION*/}
      <TableCell className="font-semibold py-4 max-w-[200px] truncate">
        {faq.question}
      </TableCell>

      {/* CATEGORY */}
      <TableCell className="hidden md:table-cell">
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
            CATEGORY_STYLES[faq.category] ?? "bg-muted text-muted-foreground"
          }`}
        >
          {faq.category.charAt(0) + faq.category.slice(1).toLowerCase()}
        </span>
      </TableCell>

      {/* ANSWER */}
      <TableCell className="hidden md:table-cell text-muted-foreground text-sm max-w-[220px] truncate">
        {faq.answer}
      </TableCell>

      {/* ORDER */}
      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
        {faq.order}
      </TableCell>

      {/* ACTIVE toggle */}
      <TableCell className="hidden md:table-cell">
        <Badge
          variant={faq.isActive ? "default" : "secondary"}
          className={`cursor-pointer text-xs ${faq.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "hover:bg-muted"}`}
          onClick={handleToggleActive}
        >
          {faq.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>

      {/* CREATED AT */}
      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
        {format(new Date(faq.createdAt), "MMM d, yyyy")}
      </TableCell>

      {/* ACTIONS */}
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-rose-50 hover:text-pink-500 cursor-pointer"
          onClick={() => onEdit(faq)}
        >
          <Edit size={16} />
        </Button>

        {!faq.isActive && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-rose-50 hover:text-pink-500 cursor-pointer"
            onClick={() => setDeleteId(faq._id)}
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
