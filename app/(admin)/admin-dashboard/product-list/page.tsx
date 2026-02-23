"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ProductSearchPanel } from "@/components/dashboard/product/ProductSearchPanel";
import { ProductTable } from "@/components/dashboard/product/ProductTable";
import { LoadingBar } from "@/components/web/LoadingBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GET_ALL_PRODUCTS_BY_ADMIN } from "@/apollo/admin/admin-query";

export default function ProductList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const {
    data: productData,
    loading: productLoading,
    refetch: productRefetch,
  } = useQuery(GET_ALL_PRODUCTS_BY_ADMIN, {
    variables: {
      input: {
        page,
        limit: 10,
        sort: "createdAt",
        search: {
          productStatus: statusFilter !== "ALL" ? statusFilter : undefined,
          text: searchQuery || undefined,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const products = productData?.getAllProductsByAdmin?.list || [];
  const totalCount =
    productData?.getAllProductsByAdmin?.metaCounter?.[0]?.total ||
    products.length;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <>
      <LoadingBar loading={productLoading} />
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Products Management
          </h1>
          <ProductSearchPanel
            onSearch={setSearchQuery}
            onStatusChange={setStatusFilter}
          />
        </div>

        <ProductTable products={products} onUpdate={productRefetch} />

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
