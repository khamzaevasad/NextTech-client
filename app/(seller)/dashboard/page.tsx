"use client";

import { useState } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { ProductStatus } from "@/lib/enums/product.enum";
import { GET_MY_STORE, GET_PRODUCTS } from "@/apollo/user/user-query";
import { ProductSearchPanel } from "@/components/dashboard/product/ProductSearchPanel";
import { ProductTable } from "@/components/dashboard/product/ProductTable";
import { userVar } from "@/apollo/store";
import { LoadingBar } from "@/components/web/LoadingBar";
import { _Store } from "@/lib/types/store/store";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const user = useReactiveVar(userVar);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const { data: storeData } = useQuery(GET_MY_STORE, {
    fetchPolicy: "cache-and-network",
    skip: !user._id,
  });

  const store: _Store | undefined = storeData?.getMyStore;

  const {
    data: productData,
    loading: productLoading,
    refetch: productRefetch,
  } = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        page,
        limit: 10,
        sort: "createdAt",
        search: {
          storeId: store?._id,
          productStatus: statusFilter !== "ALL" ? statusFilter : undefined,
          text: searchQuery || undefined,
        },
      },
    },
    fetchPolicy: "cache-and-network",
    skip: !store?._id,
  });

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const products = productData?.getProducts?.list || [];
  const totalCount =
    productData?.getProducts?.metaCounter?.[0]?.total || products.length;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalCount / 15);

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
