import { BookProps } from "@/components/app/feed/types";

export type ReviewProps = {
  id: number;
  title: string;
  content: string;
  rate: number;
  book: BookProps;
  userId: string;
};

export type ReviewDialogProps =
  | {
      type: "add";
      reviewId?: never;
    }
  | {
      type: "edit";
      reviewId: number;
    };
