"use client";

import { useState } from "react";
import { CommentGroup } from "@/lib/enums/comment.enum";
import CommentList from "../web/CommentList";
import CreateComment from "../web/CreateComment";
interface ProductReviewsProps {
  id: string;
}

export default function ArticleReviews({ id }: ProductReviewsProps) {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleCommentCreated = () => {
    // Increment trigger to refresh comment list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8 my-8">
      {/* Comment List */}
      <CommentList id={id} refreshTrigger={refreshTrigger} />

      {/* Create Comment Form */}
      <CreateComment
        id={id}
        commentGroup={CommentGroup.ARTICLE}
        showRating={false}
        title="Leave A Comment"
        placeholder="Share your thoughts about this article..."
        onCommentCreated={handleCommentCreated}
      />
    </div>
  );
}
