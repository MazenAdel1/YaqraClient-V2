import { ReviewProps } from "../../shared/posts/review";
import { DiscussionProps } from "../../shared/posts/discussion";
import { PlaylistProps } from "../../shared/posts/playlist";

export type PostType = "reviews" | "discussions" | "playlists";

export type GeneralPostProps = ReviewProps | DiscussionProps | PlaylistProps;

export type CommunityProps = {
  initialData: GeneralPostProps[];
  type: PostType;
};
