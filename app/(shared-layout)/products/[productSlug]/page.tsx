"use client";

import { GET_PRODUCT } from "@/apollo/user/user-query";
import { useQuery } from "@apollo/client";
import { use } from "react";

interface DetailProps {
  params: Promise<{
    productSlug: string;
  }>;
}

export default function Page({ params }: DetailProps) {
  const { productSlug } = use(params);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const {
    loading: getProductLoading,
    error: getProductError,
    refetch: getProductRefetch,
    data: getProductData,
  } = useQuery(GET_PRODUCT, {
    fetchPolicy: "cache-and-network",
    variables: { input: productSlug },
    notifyOnNetworkStatusChange: true,
    skip: !productSlug,
  });

  console.log("data", getProductData);

  return <div>Detail page {productSlug}</div>;
}
