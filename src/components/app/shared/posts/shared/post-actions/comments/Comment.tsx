import { cn, timeAgo } from "@/lib/utils";
import { CommentProps } from "./types";
import { UserImage } from "@/components/app/shared/user";
import { FormattedText } from "@/components/app/shared";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CommentActions from "./comment-actions/CommentActions";
import { useUserStore } from "@/providers/user-store-provider";
import CommentModifiers from "./comment-modifiers/CommentModifiers";

export default function Comment({
  comment,
  isReply,
}: {
  comment: CommentProps;
  isReply?: boolean;
}) {
  const { user: theCurrentUser } = useUserStore();

  return (
    <>
      <div className={cn("flex flex-col gap-0.5", isReply && "ms-6")}>
        <Card key={comment.id} className="gap-2 px-2 py-3">
          <CardHeader className="px-1">
            <CardTitle>
              <UserImage
                id={comment.user.userId}
                user={comment.user}
                additionalInfo={timeAgo(comment.createdDate)}
              />
            </CardTitle>
            {comment.user.userId === theCurrentUser?.id && (
              <CardAction>
                <CommentModifiers comment={comment} />
              </CardAction>
            )}
          </CardHeader>
          <CardContent className="px-2">
            <FormattedText text={comment.content} />
          </CardContent>
        </Card>
        <CommentActions comment={comment} />
      </div>
      {comment.replies?.map((reply) => (
        <Comment key={reply.id} comment={reply} isReply />
      ))}
    </>
  );
}
