import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import PostActionsWrapper from "./post-actions/PostActionsWrapper";
import { UserImage } from "../../user";
import { timeAgo } from "@/lib/utils";
import DeletePost from "./DeletePost";
import { useUserStore } from "@/providers/user-store-provider";
import { PostWrapperProps } from "./types";

export default function PostWrapper({
  children,
  post,
  editDialog,
  queryKey,
}: PostWrapperProps) {
  const { user: theCurrentUser } = useUserStore();

  return (
    <Card>
      <PostActionsWrapper
        postId={post.id}
        likeCount={post.likeCount}
        isLiked={post.isLiked}
        queryKey={queryKey}
      >
        <CardHeader className="gap-4">
          <div className="flex items-center gap-2">
            <UserImage
              id={post.userId}
              additionalInfo={timeAgo(post.createdDate)}
            />
          </div>

          {theCurrentUser?.id === post.userId && (
            <CardAction className="border-light-gray flex gap-1 rounded-md border">
              {editDialog}
              <DeletePost
                postId={post.id}
                queryKey={queryKey}
                title="هل أنت متأكد من حذف هذا المنشور"
              />
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="-mt-2 flex flex-col gap-4">
          {children}
        </CardContent>
      </PostActionsWrapper>
    </Card>
  );
}
