import { Button } from "@/components/ui/button";
import { CommentProps } from "../types";
import LikeComment from "./LikeComment";
import { useContext } from "react";
import { SelectedCommentContext } from "../CommentsDialog";

export default function CommentActions({ comment }: { comment: CommentProps }) {
  const { setSelectedComment } = useContext(SelectedCommentContext);

  return (
    <div className="ms-2 flex items-center">
      <LikeComment comment={comment} />
      <Button
        variant={"ghost"}
        size={"xs"}
        onClick={() => setSelectedComment(comment)}
      >
        الرد
      </Button>
    </div>
  );
}
