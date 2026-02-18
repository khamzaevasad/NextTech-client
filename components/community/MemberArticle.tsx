"use client";

import { GET_BOARD_ARTICLES } from "@/apollo/user/user-query";
import { BoardArticlesInquiry } from "@/lib/types/articles/article.input";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import ArticleCard from "./ArticleCard";
import { BoardArticle } from "@/lib/types/articles/article";
import { ChevronLeft, ChevronRight, PenLineIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MemberArticleProps {
  _id: string;
}

export default function MemberArticle({ _id }: MemberArticleProps) {
  const [articles, setArticles] = useState<BoardArticlesInquiry>({
    page: 1,
    limit: 12,
    search: {
      memberId: _id,
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const { data: articlesData } = useQuery(GET_BOARD_ARTICLES, {
    variables: { input: articles },
    fetchPolicy: "cache-and-network",
    skip: !_id,
  });

  const memberArticles = articlesData?.getBoardArticles?.list || [];

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const handlePageChange = (newPage: number) => {
    setArticles((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalArticles =
    articlesData?.getBoardArticles?.metaCounter?.[0]?.total ??
    memberArticles.length;

  const totalPages = Math.ceil(totalArticles / articles.limit);

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
                  disabled={articles.page === 1}
                  onClick={() => handlePageChange(articles.page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      variant={articles.page === p ? "default" : "outline"}
                      className={cn(
                        "w-10 h-10",
                        articles.page === p && "bg-pink-500 hover:bg-pink-600",
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
                  disabled={articles.page === totalPages}
                  onClick={() => handlePageChange(articles.page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-center py-20 bg-accent/10 rounded-3xl border-2 border-dashed">
              <div className="text-xl text-muted-foreground">
                <p> You haven&apos;t published any articles yet.</p>
                <p>
                  Start sharing your knowledge and ideas with the community!
                  Click the button below to write your first post.
                </p>
              </div>
              <Link
                href={"/write-article"}
                className={`${buttonVariants({})} my-9`}
              >
                <PenLineIcon /> Write Article
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
