import { CommentStatus } from "@/lib/enums/comment.enum";

export interface CommentUpdate {
  _id: string;
  commentStatus?: CommentStatus;
  commentContent?: string;
  rating?: number;
}
