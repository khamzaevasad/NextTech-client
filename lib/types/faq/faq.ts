import { FaqCategory } from "@/lib/enums/faq.enum";
import { Member } from "../member/member";
import { TotalCounter } from "../product/product";

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  memberId: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  /* ---------------------------- from aggregation ---------------------------- */

  authorData?: Member;
}

export interface Faqs {
  list: Faq[];
  metaCounter?: TotalCounter[];
}
