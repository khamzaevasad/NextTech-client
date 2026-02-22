"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@apollo/client";
import { GET_MY_STORE } from "@/apollo/user/user-query";
import { MemberType } from "@/lib/enums/member.enum";

export default function CreateStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

    if (user.memberType !== MemberType.SELLER) {
      router.replace("/403");
      return;
    }

    if (myStore) {
      router.replace("/dashboard");
    }
  }, [authLoading, storeLoading, user, myStore, router]);

  if (authLoading || storeLoading) return null;
  if (!user || user.memberType !== MemberType.SELLER || myStore) return null;

  return <>{children}</>;
}
