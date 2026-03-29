import { BookProps } from "@/components/app/feed/types";

export type PlaylistProps = {
  id: number;
  title: string;
  content: string;
  books: BookProps[];
  userId: string;
  username: string;
  createdDate: string;
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
