import { BookProps } from "@/components/app/feed/types";

export type DiscussionTag = "0" | "1" | "2" | "Discussion" | "Article" | "News";

export type DiscussionProps = {
  id: number;
  title: string;
  content: string;
  tag: DiscussionTag;
  books: BookProps[];
  userId: string;
  username: string;
  likeCount: number;
  createdDate: string;
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
