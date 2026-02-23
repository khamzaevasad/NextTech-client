"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { LoadingBar } from "@/components/web/LoadingBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GET_ALL_BOARDARTICLES_BY_ADMIN } from "@/apollo/admin/admin-query";
import { ArticleTable } from "@/components/admin/community/ArticleTable";
import { ArticlesSearchPanel } from "@/components/admin/community/ArticleSearchPanel";

export default function CommunityList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [category, setCategory] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const {
    data: articleData,
    loading: articleLoading,
    refetch: articleRefetch,
  } = useQuery(GET_ALL_BOARDARTICLES_BY_ADMIN, {
    variables: {
      input: {
        page,
        limit: 10,
        sort: "createdAt",
        search: {
          articleStatus: statusFilter !== "ALL" ? statusFilter : undefined,
          articleCategory: category !== "ALL" ? category : undefined,
          text: searchQuery || undefined,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const articles = articleData?.getAllBoardArticlesByAdmin?.list || [];
  const totalCount =
    articleData?.getAllBoardArticlesByAdmin?.metaCounter?.[0]?.total ||
    articles.length;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <>
      <LoadingBar loading={articleLoading} />
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Community Management
          </h1>
          <ArticlesSearchPanel
            onSearch={setSearchQuery}
            onStatusChange={setStatusFilter}
            onCategoryChange={setCategory}
          />
        </div>

        <ArticleTable articles={articles} onUpdate={articleRefetch} />

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
