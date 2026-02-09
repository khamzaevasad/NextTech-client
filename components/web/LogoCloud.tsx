// https://motion-primitives.com/docs/infinite-slider

import { useQuery } from "@apollo/client";
import { InfiniteSlider } from "../motion-primitives/infinite-slider";
import { GET_STORES } from "@/apollo/user/user-query";
import { StoresInquiry } from "@/lib/types/store/store.input";
import { T } from "@/lib/types/common";
import { useState } from "react";
import { Store } from "@/lib/types/store/store";
import { RATING } from "@/lib/config";
import Link from "next/link";

interface TopStoresProps {
  initialInput?: StoresInquiry;
}

export function LogoCloud({
  initialInput = {
    page: 1,
    limit: 8,
    // sort: "createdAt",
    search: {},
  },
}: TopStoresProps) {
  const [stores, setStores] = useState<Store[]>([]);
  /* ------------------------------ APOLLO CLIENT ----------------------------- */

  const {
    loading: getStoreLoading,
    data: getStoreData,
    error: getStoreError,
    refetch: getStoreRefetch,
  } = useQuery(GET_STORES, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setStores(data?.getStores?.list ?? []);
    },
  });

  return (
    <div className="mask-[linear-gradient(to_right,transparent,black,transparent)] overflow-hidden py-4">
      <InfiniteSlider gap={42} reverse speed={80} speedOnHover={25}>
        {stores.map((store) => (
          <Link
            href={"/stores"}
            className=" h-4 select-none md:h-5 dark:brightness-0 dark:invert"
            key={`logo-${store._id}`}
          >
            {store?.storeRating >= RATING ? store.storeName : ""}
          </Link>
        ))}
      </InfiniteSlider>
    </div>
  );
}
