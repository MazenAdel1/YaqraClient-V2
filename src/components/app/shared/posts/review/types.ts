import { BookProps } from "../../types";
import { PostBaseProps, PostDialogProps } from "../shared/types";

export type ReviewProps = PostBaseProps & {
  title: string;
  content: string;
  rate: number;
  book: BookProps;
};

export type ReviewDialogProps = PostDialogProps<ReviewProps>;
