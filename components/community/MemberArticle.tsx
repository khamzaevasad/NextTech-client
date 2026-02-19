"use client";

import { GET_BOARD_ARTICLES } from "@/apollo/user/user-query";
import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import ArticleCard from "./ArticleCard";
import { BoardArticle } from "@/lib/types/articles/article";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { EmptyState } from "../web/EmptyState";

interface MemberArticleProps {
  _id: string;
}

export default function MemberArticle({ _id }: MemberArticleProps) {
  const [page, setPage] = useState(1);

  const articlesInput = useMemo(() => {
    if (!_id) return null;

    return {
      page,
      limit: 12,
      search: {
        memberId: _id,
      },
    };
  }, [_id, page]);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const { data: articlesData } = useQuery(GET_BOARD_ARTICLES, {
    variables: { input: articlesInput },
    fetchPolicy: "cache-and-network",
    skip: !articlesInput,
  });

  const memberArticles = articlesData?.getBoardArticles?.list || [];

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalArticles =
    articlesData?.getBoardArticles?.metaCounter?.[0]?.total ??
    memberArticles.length;

  const totalPages = Math.ceil(totalArticles / 12);

  if (!_id) return null;

  return (
    <>
      <div className="my-8">
        <div>
          <h2 className="text-4xl font-semibold my-6 text-center">Articles</h2>
        </div>

        {memberArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-3">
              {memberArticles.map((article: BoardArticle) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>

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

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
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
                  ),
                )}

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
          </>
        ) : (
          <>
            <div className="text-center py-20 bg-accent/10 rounded-3xl border-2 border-dashed">
              <EmptyState
                icon={<FileText size={"40"} />}
                title={"Article not found"}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
