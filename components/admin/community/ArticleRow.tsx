"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@apollo/client";
import {
  REMOVE_BOARD_ARTICLE_BY_ADMIN,
  UPDATE_BOARD_ARTICLE_BY_ADMIN,
} from "@/apollo/admin/admin-mutation";
import { BoardArticle } from "@/lib/types/articles/article";
import { toast } from "sonner";
import { Clock1, Eye, Heart, Trash2Icon } from "lucide-react";
import { BoardArticleStatus } from "@/lib/enums/board-article.enum";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
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
import Link from "next/link";

interface ArticleRowProps {
  article: BoardArticle;
  onUpdate: () => void;
}

export function ArticleRow({ article, onUpdate }: ArticleRowProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const [updateArticle] = useMutation(UPDATE_BOARD_ARTICLE_BY_ADMIN);
  const [removeArticle] = useMutation(REMOVE_BOARD_ARTICLE_BY_ADMIN);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateArticle({
        variables: {
          input: {
            _id: article._id,
            articleStatus: newStatus,
          },
        },
      });
      toast.success(`Status changed to ${newStatus}`);
      onUpdate();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("handleStatusChange error", err.message);
        toast(err.message);
      } else {
        toast("Unexpected error occurred");
      }
    }
  };

  const onRemove = async (id: string) => {
    try {
      await removeArticle({
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
      {/* Title */}
      <TableCell>
        <Link
          className={buttonVariants({ variant: "link" })}
          href={`${article.articleStatus === "ACTIVE" ? `/community/${article._id}` : "#"}`}
        >
          {article.articleTitle}
        </Link>
      </TableCell>

      {/* Category */}
      <TableCell className="hidden md:table-cell font-semibold py-4">
        {article.articleCategory}
      </TableCell>

      {/* Writer */}
      <TableCell className="hidden md:table-cell">
        {article.memberData?.memberNick}
      </TableCell>

      {/* Views */}
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-pink-500" />
          {article.articleViews}
        </div>
      </TableCell>

      {/* Likes */}
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Heart size={14} className="text-pink-500" />
          {article.articleLikes}
        </div>
      </TableCell>

      {/* RegisterDate */}
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Clock1 size={14} className="text-pink-500" />
          {new Date(article.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      </TableCell>

      {/* STATUS */}
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          {article.articleStatus === BoardArticleStatus.DELETE ? (
            <Button
              onClick={() => setDeleteId(article._id)}
              size={"sm"}
              className="bg-pink-600 hover:bg-pink-500 text-white rounded-2xl cursor-pointer"
            >
              Remove <Trash2Icon size={"10"} />{" "}
            </Button>
          ) : (
            <Select
              defaultValue={article.articleStatus}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger
                className={`h-8 w-24 rounded-full text-[10px] font-bold uppercase cursor-pointer`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
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
