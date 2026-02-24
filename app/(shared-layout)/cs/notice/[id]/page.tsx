"use client";

import { use } from "react";
import { useQuery } from "@apollo/client";
import { GET_NOTICE } from "@/apollo/user/user-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface NoticeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = use(params);

  const { data, loading, error } = useQuery(GET_NOTICE, {
    variables: { input: id },
    fetchPolicy: "cache-and-network",
    skip: !id,
  });

  const notice = data?.getNotice;

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Back Button */}
          <Link href="/cs">
            <Button variant="ghost" className="mb-6 cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to CS Center
            </Button>
          </Link>

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card>
              <CardContent className="py-20 text-center">
                <p className="text-destructive mb-4">Failed to load notice</p>
              </CardContent>
            </Card>
          )}

          {/* Notice Content */}
          {notice && !loading && (
            <Card>
              <CardContent className="p-8">
                {/* Header */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center gap-3 mb-4">
                    {notice.noticeStatus === "EVENT" && (
                      <Badge className="bg-pink-500/10 text-pink-500 hover:bg-pink-500/20">
                        Event
                      </Badge>
                    )}
                    <Badge variant="outline">Notice</Badge>
                  </div>

                  <h1 className="text-3xl font-bold mb-4">
                    {notice.noticeTitle}
                  </h1>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(notice.createdAt), "MMMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{notice.noticeViews} views</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="prose prose-neutral dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: notice.noticeContent }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
