"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CREATE_COMMENT } from "@/apollo/user/user-mutation";
import { Message } from "@/lib/enums/common.enum";
import { CommentGroup } from "@/lib/enums/comment.enum";
import {
  GET_BOARD_ARTICLE,
  GET_PRODUCT,
  GET_STORE,
} from "@/apollo/user/user-query";

interface CreateCommentProps {
  id: string;
  commentGroup: CommentGroup;
  onCommentCreated?: () => void;
  showRating?: boolean;
  title?: string;
  placeholder?: string;
}

export default function CreateComment({
  id,
  commentGroup,
  onCommentCreated,
  showRating = true,
  title = "Leave A Review",
  placeholder = "Share your thoughts...",
}: CreateCommentProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getRefetchQueries = () => {
    switch (commentGroup) {
      case CommentGroup.STORE:
        return [{ query: GET_STORE, variables: { input: id } }];
      case CommentGroup.PRODUCT:
        return [{ query: GET_PRODUCT, variables: { input: id } }];
      case CommentGroup.ARTICLE:
        return [
          {
            query: GET_BOARD_ARTICLE,
            variables: { input: id },
          },
        ];
      default:
        return [];
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const [createComment] = useMutation(CREATE_COMMENT, {
    refetchQueries: getRefetchQueries(),
    awaitRefetchQueries: true,
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    if (showRating && rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      await createComment({
        variables: {
          input: {
            commentGroup: commentGroup,
            commentContent: comment.trim(),
            commentRefId: id,
            ...(showRating && { rating: rating }),
          },
        },
      });

      toast.success("Comment submitted successfully!");
      setComment("");
      setRating(0);

      if (onCommentCreated) {
        onCommentCreated();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Create comment error:", err.message);

        if (
          err.message.includes("authenticated") ||
          err.message.includes("login")
        ) {
          toast.error(Message.NOT_AUTHENTICATED);
        } else {
          toast.error(err.message || "Failed to submit comment");
        }
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars - Only show if showRating is true */}
          {showRating && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors cursor-pointer",
                          starValue <= (hoverRating || rating)
                            ? "fill-pink-500 text-pink-500"
                            : "text-muted-foreground/60 hover:text-pink-500/50",
                        )}
                      />
                    </button>
                  );
                })}
                {rating > 0 && (
                  <span className="ml-3 text-sm font-medium text-pink-500">
                    {rating} {rating === 1 ? "star" : "stars"}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Comment Textarea */}
          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="text-sm font-medium text-muted-foreground"
            >
              {showRating ? "Review" : "Comment"}
            </label>
            <Textarea
              id="comment"
              placeholder={placeholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="resize-none border-border focus:border-pink-500 focus:ring-pink-500 transition-colors"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              {comment.length} characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                isSubmitting || !comment.trim() || (showRating && rating === 0)
              }
              className="bg-pink-600 hover:bg-pink-500 text-white font-semibold px-8 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                `Submit ${showRating ? "Review" : "Comment"}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
