import { CommentGroup, Direction } from "@/lib/enums/comment.enum";

export interface CommentInput {
  commentGroup: CommentGroup;
  commentContent: string;
  commentRefId: string;
  memberId?: string;
  rating?: number;
}
interface CISearch {
  commentRefId: string;
}

export interface CommentsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: CISearch;
}
