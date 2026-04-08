import { BookProps } from "../shared";
import { DiscussionProps } from "../shared/posts/discussion";
import { PlaylistProps } from "../shared/posts/playlist";
import { ReviewProps } from "../shared/posts/review";

export type TimelinePostProps =
  | null
  | ReviewProps
  | DiscussionProps
  | PlaylistProps
  | BookProps[];
