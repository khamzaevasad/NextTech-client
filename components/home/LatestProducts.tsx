"use client";

import ProductCard from "../web/ProductCard";
import { ProductsInquiry } from "@/lib/types/product/product.input";
import { useState } from "react";
import { Product } from "@/lib/types/product/product";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/apollo/user/user-query";
import { T } from "@/lib/types/common";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { toast } from "sonner";
import { Message } from "@/lib/enums/common.enum";
import { LIKE_TARGET_PRODUCT } from "@/apollo/user/user-mutation";
import { ArrowUpRight, Package } from "lucide-react";
import { LoadingBar } from "../web/LoadingBar";
import { useTranslations } from "next-intl";
import { EmptyState } from "../web/EmptyState";

interface LatestProductsProps {
  initialInput?: ProductsInquiry;
}

function LatestProducts({
  initialInput = {
    page: 1,
    limit: 8,
    sort: "createdAt",
    search: {},
  },
}: LatestProductsProps) {
  const t = useTranslations("home.latestProducts");

  /* ------------------------------ APOLLO CLIENT ----------------------------- */
  const {
    loading: getProductsLoading,
    data: getProductsData,
    refetch: getProductsRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
  });

  const [LikeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT, {});

  /* ------------------------- Derived States ------------------------- */
  const products: Product[] = getProductsData?.getProducts?.list ?? [];
  const isInitialLoading = getProductsLoading && !getProductsData;
  const isEmpty = !getProductsLoading && products.length === 0;

  /* -------------------------------- HANDLERS -------------------------------- */
  const likeProductHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

      await LikeTargetProduct({ variables: { input: id } });
      await getProductsRefetch({ input: initialInput });
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

  /* ------------------------- RENDER ------------------------- */

  if (isInitialLoading) {
    return (
      <div className="my-8 flex flex-col items-center justify-center min-h-[200px]">
        <LoadingBar loading />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-semibold my-6">{t("title")}</h2>
        <Link href="/products" className={buttonVariants({ variant: "ghost" })}>
          {t("viewAll")} <ArrowUpRight />
        </Link>
      </div>

      {isEmpty ? (
        <div className="flex items-center my-5 justify-center">
          <EmptyState
            icon={<Package size={50} />}
            title="No Latest Products Found"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              likeProductHandler={likeProductHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestProducts;
