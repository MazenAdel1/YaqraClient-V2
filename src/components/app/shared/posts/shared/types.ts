import { DiscussionProps } from "../discussion";
import { PlaylistProps } from "../playlist";
import { ReviewProps } from "../review";

export type DeletePostProps = {
  postId: number;
  title?: string;
  queryKey: string;
};

export type PostBaseProps = {
  id: number;
  userId: string;
  username: string;
  createdDate: string;
  likeCount: number;
  isLiked: boolean;
  type?: "Review" | "DiscussionArticleNews" | "Playlist";
};

export type PostWrapperProps = {
  children: React.ReactNode;
  post: PostBaseProps & (ReviewProps | DiscussionProps | PlaylistProps);
  editDialog: React.ReactNode;
  queryKey: string;
};
