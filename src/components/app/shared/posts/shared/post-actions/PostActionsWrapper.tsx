import CommentsDialog from "./comments/CommentsDialog";
import Like from "./like/Like";
import { CardFooter } from "@/components/ui/card";
import { PostActionsProps } from "./types";

export default function PostActionsWrapper({
  children,
  postId,
  likeCount,
  isLiked,
}: PostActionsProps) {
  return (
    <>
      {children}
      <CardFooter>
        <div className="flex w-full items-center gap-4 *:flex-1">
          <Like postId={postId} likeCount={likeCount} isLiked={isLiked} />
          <CommentsDialog postId={postId}>{children}</CommentsDialog>
        </div>
      </CardFooter>
    </>
  );
}
