"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Notice } from "@/lib/types/notice/notice";

interface NoticeCardProps {
  notice: Notice;
  index: number;
}

export function NoticeCard({ notice, index }: NoticeCardProps) {
  const isEvent = notice.noticeStatus === "EVENT";
  const formattedDate = format(new Date(notice.createdAt), "MMM dd, yyyy");

  return (
    <Link href={`/cs/notice/${notice._id}`}>
      <Card className="p-4 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          {/* Index or Event Badge */}
          <div className="shrink-0 w-16">
            {isEvent ? (
              <Badge
                variant="secondary"
                className="bg-pink-500/10 text-pink-500 hover:bg-pink-500/20"
              >
                Event
              </Badge>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                #{index}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-pink-500 transition-colors line-clamp-2 mb-1">
              {notice.noticeTitle}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formattedDate}</span>
              {notice.noticeViews > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {notice.noticeViews}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
