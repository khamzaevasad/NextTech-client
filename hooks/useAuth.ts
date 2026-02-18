"use client";

import { useReactiveVar } from "@apollo/client";
import { userVar, authReadyVar } from "@/apollo/store";

export function useAuth() {
  const user = useReactiveVar(userVar);
  const authReady = useReactiveVar(authReadyVar);

  return {
    user,
    loading: !authReady,
    isAuthenticated: !!user._id,
  };
}
