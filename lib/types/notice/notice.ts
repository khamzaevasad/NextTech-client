import { NoticeStatus } from "@/lib/enums/notice.enum";
import { Member } from "../member/member";
import { TotalCounter } from "../product/product";

export interface Notice {
  _id: string;

  noticeTitle: string;
  noticeStatus: NoticeStatus;
  noticeContent: string;
  memberId: string;
  noticeViews: number;
  createdAt: Date;
  updatedAt: Date;
  /* ---------------------------- from aggregation ---------------------------- */
  authorData?: Member;
}

export interface Notices {
  list: Notice[];
  metaCounter?: TotalCounter[];
}
