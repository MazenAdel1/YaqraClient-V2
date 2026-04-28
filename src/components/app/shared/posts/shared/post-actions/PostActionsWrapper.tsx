import CommentsDialog from "./comments/CommentsDialog";
import Like from "./like/Like";
import { CardFooter } from "@/components/ui/card";
import { PostActionsProps } from "./types";

export default function PostActionsWrapper({
  children,
  postId,
  likeCount,
  isLiked,
  queryKey,
}: PostActionsProps) {
  return (
    <>
      {children}
      <CardFooter className="mt-auto">
        <div className="flex w-full items-center gap-4 *:flex-1">
          <Like
            postId={postId}
            likeCount={likeCount}
            isLiked={isLiked}
            queryKey={queryKey}
          />
          <CommentsDialog postId={postId}>{children}</CommentsDialog>
        </div>
      </CardFooter>
    </>
  );
}
