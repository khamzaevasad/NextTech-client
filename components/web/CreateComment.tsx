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

interface CreateCommentProps {
  productId: string;
  onCommentCreated?: () => void;
}

export default function CreateComment({
  productId,
  onCommentCreated,
}: CreateCommentProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [createComment] = useMutation(CREATE_COMMENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      await createComment({
        variables: {
          input: {
            commentGroup: CommentGroup.PRODUCT,
            commentContent: comment.trim(),
            commentRefId: productId,
            rating: rating,
          },
        },
      });

      toast.success("Review submitted successfully!");
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
          toast.error(err.message || "Failed to submit review");
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
        <CardTitle className="text-xl font-bold">Leave A Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
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

          {/* Review Textarea */}
          <div className="space-y-2">
            <label
              htmlFor="review"
              className="text-sm font-medium text-muted-foreground"
            >
              Review
            </label>
            <Textarea
              id="review"
              placeholder="Share your thoughts about this product..."
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
              disabled={isSubmitting || !comment.trim() || rating === 0}
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
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
