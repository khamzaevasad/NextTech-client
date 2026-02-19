"use client";

import { useQuery, useReactiveVar } from "@apollo/client";
import { Star, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { GET_COMMENTS } from "@/apollo/user/user-query";
import { API_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import { Comment } from "@/lib/types/comments/comment";
import { EmptyState } from "./EmptyState";
import { LoadingBar } from "./LoadingBar";
import Link from "next/link";
import { userVar } from "@/apollo/store";

interface CommentListProps {
  id: string;
  refreshTrigger?: number;
}

export default function CommentList({ id, refreshTrigger }: CommentListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 5;
  const user = useReactiveVar(userVar);
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const { loading, data, refetch } = useQuery(GET_COMMENTS, {
    variables: {
      input: {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: {
          commentRefId: id,
        },
      },
    },
    skip: !id,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const comments: Comment[] = data?.getComments?.list || [];
  const totalComments = data?.getComments?.metaCounter[0]?.total || 0;
  const totalPages = Math.ceil(totalComments / ITEMS_PER_PAGE);

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <LoadingBar loading={loading} />
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 fill-pink-500 text-pink-500" />
            <h3 className="text-xl font-bold">
              {totalComments} {totalComments === 1 ? "Review" : "Reviews"}
            </h3>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <EmptyState
              icon={<MessageCircle className="h-12 w-12" />}
              title="Nothing here yet "
              description="Be the first to contribute!"
            />
          ) : (
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <div
                  key={comment._id}
                  className={cn(
                    "pb-6",
                    index !== comments.length - 1 && "border-b border-border",
                  )}
                >
                  {/* User Info */}
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-pink-500/20">
                      <AvatarImage
                        src={
                          comment.memberData?.memberImage
                            ? `${API_URL}/${comment.memberData.memberImage}`
                            : undefined
                        }
                        alt={comment.memberData?.memberNick}
                      />
                      <AvatarFallback className="bg-pink-500/10 text-pink-500 font-semibold">
                        {getInitials(
                          (comment.memberData?.memberFullName ||
                            comment.memberData?.memberNick) ??
                            "User",
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <Link
                            href={
                              comment.memberData?._id === user._id
                                ? "/profile/me"
                                : `/profile/${comment.memberData?._id}`
                            }
                            className="font-semibold text-foreground"
                          >
                            {comment?.memberData?.memberFullName ||
                              comment.memberData?.memberNick}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Comment Content */}
                      <p className="text-muted-foreground leading-relaxed mt-3">
                        {comment.commentContent}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="border-border hover:border-pink-500 hover:text-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2 px-4">
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="border-border hover:border-pink-500 hover:text-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
