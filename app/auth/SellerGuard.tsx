"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function SellerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user?._id) {
      router.replace("/");
      return;
    }

    if (user.memberType !== "SELLER") {
      router.replace("/403");
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (!user || user.memberType !== "SELLER") return null;

  return <>{children}</>;
}
