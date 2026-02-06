import {
  MemberAuthType,
  MemberStatus,
  MemberType,
} from "@/lib/enums/member.enum";
import { Store } from "../store/store";
import { MeFollowed } from "../follow/follow";

export interface Member {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberAuthType: MemberAuthType;
  memberPhone: string;
  memberNick: string;
  memberPassword?: string;
  memberFullName?: string;
  memberImage: string;
  memberAddress?: string;
  memberDesc?: string;
  memberArticles: number;
  memberFollowers: number;
  memberFollowings: number;
  memberPoints: number;
  memberRank: number;
  memberWarnings: number;
  memberBlocks: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  accessToken?: string;
  /* ---------------------------- from aggregation ---------------------------- */
  storeData?: Store;
  meFollowed?: MeFollowed[];
}

export interface TotalCounter {
  total: number;
}

// members
export interface Members {
  list: Member[];
  metaCounter: TotalCounter[];
}
