import { BookProps } from "@/components/app/feed/types";
import { PostBaseProps } from "../shared/types";

export type PlaylistProps = PostBaseProps & {
  title: string;
  content: string;
  books: BookProps[];
};

export type PlaylistDialogProps =
  | {
      type: "add";
      playlist?: never;
    }
  | {
      type: "edit";
      playlist: PlaylistProps;
    };
