"use client";

import { GET_VISITED } from "@/apollo/user/user-query";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Store } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { OrdinaryInquiry } from "@/lib/types/product/product.input";
import StoreCard from "../web/StoreCard";
import { _Store } from "@/lib/types/store/store";

export default function RecentlyVisited() {
  const [visited, setVisited] = useState<OrdinaryInquiry>({
    page: 1,
    limit: 8,
  });

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const { data: visitedData } = useQuery(GET_VISITED, {
    variables: { input: visited },
    fetchPolicy: "cache-and-network",
  });

  const visitStore = visitedData?.getVisited?.list || [];

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const handlePageChange = (newPage: number) => {
    setVisited((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalStore =
    visitedData?.getVisited?.metaCounter?.[0]?.total ?? visitStore.length;

  const totalPages = Math.ceil(totalStore / visited.limit);

  return (
    <>
      <div className="my-8">
        <div>
          <h2 className="text-4xl font-semibold my-6 text-center">
            Recently Visited
          </h2>
        </div>

        {visitStore.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-3">
              {visitStore.map((store: _Store) => (
                <StoreCard key={store._id} store={store} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={visited.page === 1}
                  onClick={() => handlePageChange(visited.page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      variant={visited.page === p ? "default" : "outline"}
                      className={cn(
                        "w-10 h-10",
                        visited.page === p && "bg-pink-500 hover:bg-pink-600",
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
                  disabled={visited.page === totalPages}
                  onClick={() => handlePageChange(visited.page + 1)}
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
                <p> You haven&apos; visited any stores yet.</p>
                <p>
                  Explore our curated list of tech stores to find the best
                  components and devices for your needs!
                </p>
              </div>
              <Link href={"/stores"} className={`${buttonVariants({})} my-9`}>
                <Store /> Store List
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
