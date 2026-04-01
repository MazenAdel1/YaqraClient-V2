import { CommentProps } from "../posts/post-actions/comments/types";

export type UserImageProps = {
  id: string;
  user?: CommentProps["user"];
  innavigable?: boolean;
  showName?: boolean;
};
