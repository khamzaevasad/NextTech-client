"use client";

import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { API_URL } from "@/lib/config";
import { BoardArticle } from "@/lib/types/articles/article";

interface ArticleCardProps {
  article: BoardArticle;
  className?: string;
}

export default function ArticleCard({ article, className }: ArticleCardProps) {
  const {
    articleTitle,
    memberData,
    articleViews,
    articleLikes,
    articleComments,
    createdAt,
    _id,
  } = article;

  const formattedDate = format(new Date(createdAt), "MMM dd, yyyy");

  return (
    <Link href={`/community/${_id}`} className="block h-full">
      <figure
        className={cn(
          "relative grid grid-cols-[auto_1fr] gap-x-3 overflow-hidden bg-background p-4 border rounded-xl h-full transition-all hover:bg-accent/10",
          className,
        )}
      >
        {/* MagicUI Grid Pattern Background */}
        <div className="mask-[radial-gradient(farthest-side_at_top,white,transparent)] pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full">
          <GridPattern
            className="absolute inset-0 size-full stroke-border"
            height={20}
            width={20}
            x={-12}
            y={4}
          />
        </div>

        {/* Author Avatar */}
        <Avatar className="size-8 rounded-full border">
          <AvatarImage
            src={`${API_URL}/${memberData?.memberImage}`}
            alt={memberData?.memberNick}
          />
          <AvatarFallback className="bg-rose-500 text-white text-[10px]">
            {memberData?.memberNick?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header: Author & Date */}
          <figcaption className="-mt-0.5 -space-y-0.5">
            <cite className="text-sm not-italic font-medium text-foreground">
              {memberData?.memberNick}
            </cite>
            <span className="block font-light text-[11px] text-muted-foreground tracking-tight">
              {formattedDate}
            </span>
          </figcaption>

          {/* Title */}
          <blockquote className="mt-3 flex-grow">
            <p className="text-foreground/90 text-sm font-semibold tracking-wide line-clamp-2">
              {articleTitle}
            </p>
          </blockquote>

          {/* Stats Section */}
          <div className="mt-4 flex items-center gap-4 border-t pt-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Eye className="size-3.5" />
              <span className="text-[11px] font-medium">{articleViews}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MessageCircle className="size-3.5" />
              <span className="text-[11px] font-medium">{articleComments}</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-500 ml-auto">
              <Heart className="size-3.5" />
              <span className="text-[11px] font-bold">{articleLikes}</span>
            </div>
          </div>
        </div>
      </figure>
    </Link>
  );
}
