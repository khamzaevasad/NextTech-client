"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user?._id) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return null; // yoki <Spinner />

  return children;
}
