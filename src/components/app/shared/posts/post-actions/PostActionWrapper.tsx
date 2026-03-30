import { CardFooter } from "@/components/ui/card";
import PostActions from "./PostActions";
import { PostActionsProps } from "./types";

export default function PostActionWrapper({
  children,
  postId,
  likeCount,
  isLiked,
}: PostActionsProps) {
  return (
    <>
      {children}
      <CardFooter>
        <PostActions postId={postId} likeCount={likeCount} isLiked={isLiked}>
          {children}
        </PostActions>
      </CardFooter>
    </>
  );
}
