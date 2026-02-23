"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { MemberType } from "@/lib/enums/member.enum";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!user?._id) {
      router.replace("/auth/login");
      return;
    }

    if (user.memberType !== MemberType.ADMIN) {
      router.replace("/403");
    }
  }, [authLoading, user, router]);

  if (authLoading) return null;
  if (!user || user.memberType !== MemberType.ADMIN) return null;

  return <>{children}</>;
}
