import { CommentProps } from "../types";
import DeleteComment from "./DeleteComment";
import EditComment from "./EditComment";

export default function CommentModifiers({
  comment,
}: {
  comment: CommentProps;
}) {
  return (
    <>
      <EditComment comment={comment} />
      <DeleteComment comment={comment} />
    </>
  );
}
