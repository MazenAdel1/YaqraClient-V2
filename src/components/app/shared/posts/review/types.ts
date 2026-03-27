import { BookProps } from "@/components/app/feed/types";

export type ReviewProps = {
  id: number;
  title: string;
  content: string;
  rate: number;
  book: BookProps;
  userId: string;
  username: string;
  createdDate: string;
};

export type ReviewDialogProps =
  | {
      type: "add";
      review?: never;
    }
  | {
      type: "edit";
      review: ReviewProps;
    };
