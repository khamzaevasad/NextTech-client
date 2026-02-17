"use client";

import { useState } from "react";
import { CommentGroup } from "@/lib/enums/comment.enum";
import CommentList from "../web/CommentList";
import CreateComment from "../web/CreateComment";
interface ProductReviewsProps {
  id: string;
}

export default function StoreReviews({ id }: ProductReviewsProps) {
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
        commentGroup={CommentGroup.STORE}
        showRating={false}
        title="Write A Comment"
        placeholder="What do you think about this store?"
        onCommentCreated={handleCommentCreated}
      />
    </div>
  );
}
