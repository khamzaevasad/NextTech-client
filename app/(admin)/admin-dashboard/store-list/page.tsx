"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { LoadingBar } from "@/components/web/LoadingBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StoreSearchPanel } from "@/components/admin/store/StoreSearchPanel";
import { StoreTable } from "@/components/admin/store/StoreTable";
import { GET_STORES_BY_ADMIN } from "@/apollo/admin/admin-query";

export default function StoreList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const {
    data: storeData,
    loading: storeLoading,
    refetch: storeRefetch,
  } = useQuery(GET_STORES_BY_ADMIN, {
    variables: {
      input: {
        page,
        limit: 10,
        sort: "createdAt",
        search: {
          storeStatus: statusFilter !== "ALL" ? statusFilter : undefined,
          text: searchQuery || undefined,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const stores = storeData?.getStoresByAdmin?.list || [];
  const totalCount =
    storeData?.getStoresByAdmin?.metaCounter?.[0]?.total || stores.length;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <>
      <LoadingBar loading={storeLoading} />
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Stores Management
          </h1>
          <StoreSearchPanel
            onSearch={setSearchQuery}
            onStatusChange={setStatusFilter}
          />
        </div>

        <StoreTable stores={stores} onUpdate={storeRefetch} />

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
