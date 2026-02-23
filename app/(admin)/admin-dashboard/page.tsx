"use client";

import { GET_ALL_MEMBERS_BY_ADMIN } from "@/apollo/admin/admin-query";
import { MemberSearchPanel } from "@/components/admin/member/MemberSearchPanel";
import { MemberTable } from "@/components/admin/member/MemberTable";
import { Button } from "@/components/ui/button";
import { LoadingBar } from "@/components/web/LoadingBar";
import { cn } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function UserList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [memberTypeFilter, setMemberTypeFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const {
    data: memberData,
    loading: memberLoading,
    refetch: memberRefetch,
  } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
    variables: {
      input: {
        page,
        limit: 10,

        search: {
          memberStatus: statusFilter !== "ALL" ? statusFilter : undefined,
          memberType: memberTypeFilter !== "ALL" ? memberTypeFilter : undefined,
          text: searchQuery || undefined,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const members = memberData?.getAllMembersByAdmin?.list || [];
  const totalCount =
    memberData?.getAllMembersByAdmin?.metaCounter?.[0]?.total || members.length;
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const totalPages = Math.ceil(totalCount / 10);

  return (
    <>
      <LoadingBar loading={memberLoading} />
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Members Management
          </h1>
          <MemberSearchPanel
            onSearch={setSearchQuery}
            onStatusChange={setStatusFilter}
            onMemberTypeChange={setMemberTypeFilter}
          />
        </div>

        <MemberTable members={members} onUpdate={memberRefetch} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={page === p ? "default" : "outline"}
                className={cn(
                  "w-10 h-10",
                  page === p && "bg-pink-500 hover:bg-pink-600",
                )}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
