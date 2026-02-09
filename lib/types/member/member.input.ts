import { Direction } from "@/lib/enums/comment.enum";
import {
  MemberAuthType,
  MemberStatus,
  MemberType,
} from "@/lib/enums/member.enum";

export interface MemberInput {
  memberNick: string;
  memberPassword: string;
  memberPhone: string;
  memberType?: MemberType;
  memberAuthType?: MemberAuthType;
}
export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

/**Inquiry**/
interface SearchSeller {
  text?: string;
}
export interface SellersInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: SearchSeller;
}

/* -------------------------------------------------------------------------- */
/*                                  FOR ADMIN                                 */
/* -------------------------------------------------------------------------- */

interface SearchMembers {
  memberStatus?: MemberStatus;
  memberType?: MemberType;
  text?: string;
}

export interface MembersInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: SearchMembers;
}
