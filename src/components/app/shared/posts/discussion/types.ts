import { BookProps } from "@/components/app/feed/types";
import { PostBaseProps } from "../shared/types";

export type DiscussionTag = "0" | "1" | "2" | "Discussion" | "Article" | "News";

export type DiscussionProps = PostBaseProps & {
  title: string;
  content: string;
  tag: DiscussionTag;
  books: BookProps[];
};

export type DiscussionDialogProps =
  | {
      type: "add";
      discussion?: never;
    }
  | {
      type: "edit";
      discussion: DiscussionProps;
    };
