import { CustomJwtPayload } from "@/lib/types/customJwtPayloads";
import { makeVar } from "@apollo/client";

export const themeVar = makeVar({});
export const authReadyVar = makeVar(false);

export const userVar = makeVar<CustomJwtPayload>({
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
  memberFollowers: 0,
  memberFollowings: 0,
  memberPoints: 0,
  memberWarnings: 0,
  memberBlocks: 0,
});
