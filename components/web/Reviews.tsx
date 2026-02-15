"use client";

import { useState } from "react";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";
interface ProductReviewsProps {
  productId: string;
}

export default function Reviews({ productId }: ProductReviewsProps) {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleCommentCreated = () => {
    // Increment trigger to refresh comment list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8 my-8">
      {/* Comment List */}
      <CommentList productId={productId} refreshTrigger={refreshTrigger} />

      {/* Create Comment Form */}
      <CreateComment
        productId={productId}
        onCommentCreated={handleCommentCreated}
      />
    </div>
  );
}
