"use client";

import { useQuery } from "@apollo/client";
import { LoadingBar } from "@/components/web/LoadingBar";
import { GET_STORE } from "@/apollo/user/user-query";
import { use } from "react";
import StoreDetailPage from "@/components/store/StoreDetail";

interface StorePageProps {
  params: Promise<{ _id: string }>;
}

export default function StorePage({ params }: StorePageProps) {
  const { _id } = use(params);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const {
    data: storeData,
    loading: storeLoading,
    error: storeError,
  } = useQuery(GET_STORE, {
    variables: { input: _id },
    fetchPolicy: "cache-and-network",
    skip: !_id,
  });

  const getStoreData = storeData?.getStore;

  if (storeError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-muted-foreground">{storeError.message}</p>
        </div>
      </div>
    );
  }

  if (storeLoading && !getStoreData) {
    return (
      <>
        <LoadingBar loading={storeLoading} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingBar loading={storeLoading} />
      <StoreDetailPage store={getStoreData} />
    </>
  );
}
