"use client";

import { useQuery } from "@apollo/client";
import { GET_NOTICES } from "@/apollo/user/user-query";
import { EmptyState } from "@/components/web/EmptyState";
import { Bell } from "lucide-react";
import { NoticeCard } from "./NoticeCard";
import { Notice } from "@/lib/types/notice/notice";
import { LoadingBar } from "../web/LoadingBar";

export function NoticeSection() {
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const { data, loading } = useQuery(GET_NOTICES, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: 20,
        search: {},
      },
    },
  });

  const notices = data?.getNotices?.list ?? [];

  if (!loading && notices.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="h-12 w-12" />}
        title="No notices available"
      />
    );
  }

  return (
    <>
      <LoadingBar loading={loading} />
      <div className="space-y-4">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-1">Notices</h2>
          <p className="text-sm text-muted-foreground">
            Stay updated with our latest announcements
          </p>
        </div>

        <div className="space-y-2">
          {notices.map((notice: Notice, index: number) => (
            <NoticeCard key={notice._id} notice={notice} index={index + 1} />
          ))}
        </div>
      </div>
    </>
  );
}
