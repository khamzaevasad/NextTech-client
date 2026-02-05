"use client";

import { useEffect } from "react";
import { getJwtToken, updateUserInfo } from "@/lib/auth";
import { authReadyVar } from "@/apollo/store";

export function AuthInitializer() {
  useEffect(() => {
    const token = getJwtToken();
    if (token) {
      updateUserInfo(token);
    }
    authReadyVar(true);
  }, []);

  return null;
}
