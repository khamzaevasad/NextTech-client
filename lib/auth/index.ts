"use client";
import decodeJWT from "jwt-decode";
import { CustomJwtPayload } from "../types/customJwtPayloads";
import { userVar } from "@/apollo/store";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getJwtToken(): any {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") ?? "";
  }
}

/* ------------------------------- setJwtToken ------------------------------ */
export function setJwtToken(token: string) {
  localStorage.setItem("accessToken", token);
}

/* ------------------------------ updateStorage ----------------------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
  setJwtToken(jwtToken);
  window.localStorage.setItem("login", Date.now().toString());
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUserInfo = (jwtToken: any) => {
  if (!jwtToken) return false;

  const claims = decodeJWT<CustomJwtPayload>(jwtToken);
  userVar({
    _id: claims._id ?? "",
    memberType: claims.memberType ?? "",
    memberStatus: claims.memberStatus ?? "",
    memberAuthType: claims.memberAuthType,
    memberPhone: claims.memberPhone ?? "",
    memberNick: claims.memberNick ?? "",
    memberFullName: claims.memberFullName ?? "",
    memberImage:
      claims.memberImage === null || claims.memberImage === undefined
        ? "defaultUser.svg"
        : `${claims.memberImage}`,
    memberAddress: claims.memberAddress ?? "",
    memberDesc: claims.memberDesc ?? "",
    memberRank: claims.memberRank,
    memberArticles: claims.memberArticles,
    memberPoints: claims.memberPoints,
    memberWarnings: claims.memberWarnings,
    memberBlocks: claims.memberBlocks,
  });
};

export const deleteStorage = () => {
  localStorage.removeItem("accessToken");
  window.localStorage.setItem("login", Date.now().toString());
};

/* ----------------------------- deleteUserInfo ----------------------------- */
export const deleteUserInfo = () => {
  userVar({
    _id: "",
    memberType: "",
    memberStatus: "",
    memberAuthType: "",
    memberPhone: "",
    memberNick: "",
    memberFullName: "",
    memberImage: "",
    memberAddress: "",
    memberDesc: "",
    memberRank: 0,
    memberArticles: 0,
    memberPoints: 0,
    memberWarnings: 0,
    memberBlocks: 0,
  });
};
