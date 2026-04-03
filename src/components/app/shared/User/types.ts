import { CommentProps } from "../posts/shared/post-actions/comments/types";

export type UserImageProps = {
  id: string;
  user?: CommentProps["user"];
  innavigable?: boolean;
  additionalInfo?: string;
};
