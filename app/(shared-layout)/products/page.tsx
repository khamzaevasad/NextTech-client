"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ProductCard from "@/components/web/ProductCard";
import { ProductsInquiry } from "@/lib/types/product/product.input";
import { Product } from "@/lib/types/product/product";
import { Direction } from "@/lib/enums/comment.enum";
import { GET_CATEGORIES, GET_PRODUCTS } from "@/apollo/user/user-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductFilter } from "@/components/web/Hybridproductfilter";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/user-mutation";
import { Message } from "@/lib/enums/common.enum";
import { T } from "@/lib/types/common";
import { toast } from "sonner";

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductsInquiry>({
    page: 1,
    limit: 9,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {},
  });

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const [LikeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT, {});
  const { data: catData } = useQuery(GET_CATEGORIES, {
    variables: { input: { page: 1, limit: 100, search: {} } },
  });

  const {
    data: prodData,
    loading: prodLoading,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    variables: { input: filters },
    fetchPolicy: "cache-and-network",
  });

  const categories = catData?.getCategories?.list || [];
  const products = prodData?.getProducts?.list || [];
  const totalProducts = prodData?.getProducts?.metaCounter?.[0]?.total || 0;
  const totalPages = Math.ceil(totalProducts / filters.limit);

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  /* -------------------------- Pagination Helper -------------------------- */
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* --------------------------- likeProductHandler --------------------------- */
  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await LikeTargetProduct({
        variables: {
          input: id,
        },
      });

      await getProductsRefetch({ input: filters });
      toast("success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("likePropertyHandler error", err.message);
        toast(err.message);
      } else {
        toast("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR */}
        <div className="w-full lg:w-72 shrink-0">
          <ProductFilter
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
            categoryId={filters.search.categoryId}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {filters.search.categoryId
                ? categories.find((c) => c._id === filters.search.categoryId)
                    ?.categoryName
                : "All Products"}
            </h1>
            <p className="text-muted-foreground">{totalProducts} items found</p>
          </div>

          {prodLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-100 bg-card/50 animate-pulse rounded-2xl border"
                />
              ))}
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product: Product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        likeProductHandler={likeProductHandler}
                      />
                    ))}
                  </div>

                  {/* PAGINATION UI */}
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={filters.page === 1}
                      onClick={() => handlePageChange(filters.page - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Button
                          key={p}
                          variant={filters.page === p ? "default" : "outline"}
                          className={cn(
                            "w-10 h-10",
                            filters.page === p &&
                              "bg-pink-500 hover:bg-pink-600",
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
                      disabled={filters.page === totalPages}
                      onClick={() => handlePageChange(filters.page + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 bg-accent/10 rounded-3xl border-2 border-dashed">
                  <p className="text-xl text-muted-foreground">
                    No products found in this selection.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
