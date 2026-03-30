import { BookProps } from "@/components/app/feed/types";
import { PostBaseProps } from "../shared/types";

export type ReviewProps = PostBaseProps & {
  title: string;
  content: string;
  rate: number;
  book: BookProps;
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
