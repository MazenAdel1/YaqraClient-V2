import { CommentProps } from "../types";
import DeleteComment from "./DeleteComment";
import EditComment from "./EditComment";

export default function CommentModifiers({
  comment,
}: {
  comment: CommentProps;
}) {
  return (
    <div className="border-light-gray flex gap-1 rounded-md border">
      <EditComment comment={comment} />
      <DeleteComment comment={comment} />
    </div>
  );
}
