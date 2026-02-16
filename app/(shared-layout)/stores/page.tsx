"use client";
import { GET_STORES } from "@/apollo/user/user-query";
import StoreCard from "@/components/web/StoreCard";
import { useQuery } from "@apollo/client";

export default function StorePage() {
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const {
    data: storeData,
    loading: storeLoading,
    refetch: storeRefetch,
  } = useQuery(GET_STORES, {
    variables: {
      input: {
        page: 1,
        limit: 9,
        // sort: "createdAt",
        // direction: Direction.DESC,
        search: {},
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const stores = storeData?.getStores?.list || [];
  console.log("stores", stores);

  return (
    <div className="my-8">
      <div className="flex items-center justify-between">stores</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-3">
        {stores.map((store) => (
          <StoreCard key={store._id} store={store} />
        ))}
      </div>
    </div>
  );
}
