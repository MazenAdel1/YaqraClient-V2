import { BookProps } from "../../types";
import { PostBaseProps, PostDialogProps } from "../shared/types";

export type DiscussionTag = "0" | "1" | "2" | "Discussion" | "Article" | "News";

export type DiscussionProps = PostBaseProps & {
  title: string;
  content: string;
  tag: DiscussionTag;
  books: BookProps[];
};

export type DiscussionDialogProps = PostDialogProps<DiscussionProps>;
