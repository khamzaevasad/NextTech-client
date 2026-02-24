"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCw } from "lucide-react";
import { NoticeStatus } from "@/lib/enums/notice.enum";
import { Notice } from "@/lib/types/notice/notice";
import { GET_NOTICE_BY_ADMIN } from "@/apollo/admin/admin-query";
import NoticeTable from "./NoticesTable";
import NoticeFormModal from "./NoticesFormModal";
import NoticeViewModal from "./NoticeViewModal";

const LIMIT = 1;

interface NoticesPanelProps {
  onSuccess: () => void;
  setStatusFilter: () => void;
  notices: Notice[];
}

export default function NoticesPanel({ notices }: NoticesPanelProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<NoticeStatus | "ALL">("ALL");
  const [editNotice, setEditNotice] = useState<Notice | null>(null);
  const [viewNotice, setViewNotice] = useState<Notice | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  // const { data, loading, refetch } = useQuery(GET_NOTICE_BY_ADMIN, {
  //   variables: {
  //     input: {
  //       page,
  //       limit: LIMIT,
  //       search: statusFilter !== "ALL" ? { noticeStatus: statusFilter } : {},
  //     },
  //   },
  //   fetchPolicy: "cache-and-network",
  // });

  // const notices: Notice[] = data?.getNoticesByAdmin?.list ?? [];
  // const total: number = data?.getNoticesByAdmin?.metaCounter?.total ?? 0;

  const handleFilterChange = (val: string) => {
    setStatusFilter(val as NoticeStatus | "ALL");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="HOLD">Hold</SelectItem>
              <SelectItem value="EVENT">Event</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => refetch()}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Button
          size="sm"
          className="h-9 gap-1.5"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Notice
        </Button>
      </div>
      {/* Table */}
      <NoticeTable
        notices={notices}
        total={total}
        page={page}
        limit={LIMIT}
        onPageChange={setPage}
        onEdit={(n) => setEditNotice(n)}
        onView={(n) => setViewNotice(n)}
        loading={loading}
      />
      {/* Modals */}
      <NoticeFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={refetch}
      />
      <NoticeFormModal
        open={!!editNotice}
        onClose={() => setEditNotice(null)}
        notice={editNotice}
        onSuccess={refetch}
      />
      <NoticeViewModal
        open={!!viewNotice}
        onClose={() => setViewNotice(null)}
        notice={viewNotice}
      />
    </div>
  );
}
