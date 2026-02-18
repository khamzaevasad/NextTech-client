import { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  memberType: string;
  memberStatus: string;
  memberAuthType: string;
  memberPhone: string;
  memberNick: string;
  memberFullName?: string;
  memberImage?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberRank: number;
  memberArticles: number;
  memberFollowers: number;
  memberFollowings: number;
  memberPoints: number;
  memberWarnings: number;
  memberBlocks: number;
  deletedAt?: Date;
}
