"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@apollo/client";
import { GET_MY_STORE } from "@/apollo/user/user-query";

export function SellerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const { data, loading: storeLoading } = useQuery(GET_MY_STORE, {
    variables: { input: user?._id },
    skip: !user?._id,
    fetchPolicy: "network-only",
  });

  const myStore = data?.getMyStore;

  useEffect(() => {
    if (authLoading || storeLoading) return;

    if (!user?._id) {
      router.replace("/");
      return;
    }

    if (user.memberType !== "SELLER") {
      router.replace("/403");
      return;
    }

    if (!myStore) {
      router.replace("/dashboard/create-store");
    }
  }, [authLoading, storeLoading, user, myStore, router]);

  if (authLoading || storeLoading) return null;

  if (!user || user.memberType !== "SELLER" || !myStore) return null;

  return <>{children}</>;
}
