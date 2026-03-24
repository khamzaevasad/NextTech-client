"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useSearchParams, useRouter } from "next/navigation";
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
import { LoadingBar } from "@/components/web/LoadingBar";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryIdFromUrl = searchParams.get("categoryId");

  const [filters, setFilters] = useState<ProductsInquiry>({
    page: 1,
    limit: 9,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {},
  });

  const [LikeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

  /* -------------------------- Categories -------------------------- */

  const { data: catData } = useQuery(GET_CATEGORIES, {
    variables: { input: { page: 1, limit: 100, search: {} } },
  });

  const categories = catData?.getCategories?.list || [];

  const getChildCategoryIds = (parentId: string): string[] => {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => cat._id);
  };

  const isParentCategory = (categoryId: string): boolean => {
    return categories.some((cat) => cat.parentId === categoryId);
  };

  const computeCategoryIds = (categoryId?: string): string[] | undefined => {
    if (!categoryId) return undefined;

    if (isParentCategory(categoryId)) {
      const childIds = getChildCategoryIds(categoryId);
      return childIds.length > 0 ? childIds : undefined;
    }

    return undefined;
  };

  /* -------------------------- Init from URL -------------------------- */

  useEffect(() => {
    if (categoryIdFromUrl && categories.length > 0) {
      const categoryIds = computeCategoryIds(categoryIdFromUrl);

      setFilters({
        page: 1,
        limit: 9,
        sort: "createdAt",
        direction: Direction.DESC,
        search: {
          categoryId: categoryIdFromUrl,
          categoryIds,
        },
      });
    }
  }, [categoryIdFromUrl, categories.length]);

  /* -------------------------- Products -------------------------- */

  const {
    data: prodData,
    loading: prodLoading,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    variables: { input: filters },
    fetchPolicy: "cache-and-network",
    skip: categories.length === 0,
  });

  const products = prodData?.getProducts?.list || [];
  const totalProducts = prodData?.getProducts?.metaCounter?.[0]?.total || 0;
  const totalPages = Math.ceil(totalProducts / filters.limit);

  /* -------------------------- Loading States -------------------------- */

  const isInitialLoading = prodLoading && !prodData;
  const isEmpty = !prodLoading && prodData && products.length === 0;

  /* -------------------------- Handlers -------------------------- */

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: ProductsInquiry) => {
    const categoryIds = computeCategoryIds(newFilters.search.categoryId);

    const updatedFilters = {
      ...newFilters,
      search: {
        ...newFilters.search,
        categoryIds,
      },
    };

    setFilters(updatedFilters);

    const params = new URLSearchParams();

    if (newFilters.search.categoryId) {
      params.set("categoryId", newFilters.search.categoryId);
    }

    if (newFilters.search.text) {
      params.set("search", newFilters.search.text);
    }

    if (newFilters.search.priceRange) {
      params.set("minPrice", newFilters.search.priceRange.start.toString());
      params.set("maxPrice", newFilters.search.priceRange.end.toString());
    }

    router.push(
      params.toString() ? `/products?${params.toString()}` : "/products",
      { scroll: false },
    );
  };

  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await LikeTargetProduct({
        variables: { input: id },
      });

      await getProductsRefetch({ input: filters });
      toast.success("Success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  const activeCategoryName = filters.search.categoryId
    ? categories.find((c) => c._id === filters.search.categoryId)?.categoryName
    : "All Products";

  /* -------------------------- Render -------------------------- */

  if (isInitialLoading) {
    return (
      <>
        <LoadingBar loading />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingBar loading={prodLoading} />

      <div className="container mx-auto px-4 py-10 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 shrink-0">
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              categoryId={filters.search.categoryId}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                {activeCategoryName}
              </h1>
              <p className="text-muted-foreground">
                {totalProducts} {totalProducts === 1 ? "item" : "items"} found
              </p>
            </div>

            {isEmpty ? (
              <div className="text-center py-20 bg-accent/10 rounded-3xl border-2 border-dashed">
                <p className="text-xl text-muted-foreground">
                  No products found in this selection.
                </p>
              </div>
            ) : (
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

                {totalPages > 1 && (
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
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
