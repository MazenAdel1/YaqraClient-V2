import { BookProps } from "../../types";
import { PostBaseProps, PostDialogProps } from "../shared/types";

export type PlaylistProps = PostBaseProps & {
  title: string;
  content: string;
  books: BookProps[];
};

export type PlaylistDialogProps = PostDialogProps<PlaylistProps>;
