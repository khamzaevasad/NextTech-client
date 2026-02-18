"use client";

import { useQuery } from "@apollo/client";
import { GET_BOARD_ARTICLES } from "@/apollo/user/user-query";
import ArticleCard from "./ArticleCard";
import { BoardArticlesInquiry } from "@/lib/types/articles/article.input";
import { BoardArticles } from "@/lib/types/articles/article";
import { LoadingBar } from "../web/LoadingBar";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleGridProps {
  category: string;
}

export default function ArticleGrid({ category }: ArticleGridProps) {
  const [filters, setFilters] = useState<BoardArticlesInquiry>({
    page: 1,
    limit: 8,
    search: {},
  });
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const { data, loading } = useQuery<{
    getBoardArticles: BoardArticles;
  }>(GET_BOARD_ARTICLES, {
    variables: {
      input: {
        page: filters.page,
        limit: filters.limit,
        sort: "createdAt",
        direction: "DESC",
        search: {
          articleCategory: category,
        },
      } as BoardArticlesInquiry,
    },
    fetchPolicy: "cache-and-network",
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const articles = data?.getBoardArticles?.list || [];
  const total = data?.getBoardArticles?.metaCounter?.[0]?.total || 0;

  const totalArticles =
    data?.getBoardArticles?.metaCounter?.[0]?.total ?? articles.length;

  const totalPages = Math.ceil(totalArticles / filters.limit);

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No articles found</p>
      </div>
    );
  }

  return (
    <>
      <LoadingBar loading={loading} />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>

        {/* PAGINATION */}
        {total > articles.length && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={filters.page === 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={filters.page === p ? "default" : "outline"}
                className={cn(
                  "w-10 h-10",
                  filters.page === p && "bg-pink-500 hover:bg-pink-600",
                )}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              disabled={filters.page === totalPages}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
