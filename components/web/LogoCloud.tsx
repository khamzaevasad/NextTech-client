"use client";

// https://motion-primitives.com/docs/infinite-slider

import { useQuery } from "@apollo/client";
import { InfiniteSlider } from "../motion-primitives/infinite-slider";
import { GET_STORES } from "@/apollo/user/user-query";
import { StoresInquiry } from "@/lib/types/store/store.input";
import { T } from "@/lib/types/common";
import { useState } from "react";
import { _Store } from "@/lib/types/store/store";
import StoreCard from "./StoreCard";
import { Empty } from "../ui/empty";
import { EmptyState } from "./EmptyState";
import { Store } from "lucide-react";

interface TopStoresProps {
  initialInput?: StoresInquiry;
}

export function LogoCloud({
  initialInput = {
    page: 1,
    limit: 12,
    search: {},
  },
}: TopStoresProps) {
  const [stores, setStores] = useState<_Store[]>([]);

  const { loading } = useQuery(GET_STORES, {
    fetchPolicy: "cache-and-network",
    variables: { input: initialInput },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      const filtered = (data?.getStores?.list ?? []).filter(
        (store: _Store) => store.storeRating > 0,
      );
      setStores(filtered);
    },
  });

  if (loading && stores.length === 0) {
    return (
      <div className="flex gap-5 overflow-hidden py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-96 w-70 shrink-0 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    );
  }

  if (!stores.length)
    return <EmptyState icon={<Store />} title="No top Store Found" />;

  return (
    <div className="overflow-hidden py-4 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <InfiniteSlider gap={20} reverse={false} speed={54} speedOnHover={20}>
        {stores.map((store) => (
          <div key={store._id} className="w-70 shrink-0">
            <StoreCard store={store} />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}
