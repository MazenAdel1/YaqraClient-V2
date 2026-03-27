import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/providers/user-store-provider";
import { DiscussionProps } from "./types";
import DiscussionDialog from "./DiscussionDialog";
import { UserImage } from "../../user";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import { Book } from "lucide-react";
import DeletePost from "../shared/DeletePost";
import { Badge } from "@/components/ui/badge";
import { TAGS } from "./consts";
import FormattedText from "../../FormattedText";

export default function Discussion({
  discussion,
}: {
  discussion: DiscussionProps;
}) {
  const { user: theCurrentUser } = useUserStore();

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-center gap-2">
          <UserImage id={discussion.userId} />
          <div className="flex flex-col gap-0.5">
            <Link href={`/profile/${discussion.userId}`}>
              {discussion.username}
            </Link>
            <span className="text-[10px] text-gray-300">
              {timeAgo(discussion.createdDate)}
            </span>
          </div>
        </div>
        <Badge variant={"secondary"}>
          {TAGS[discussion.tag as keyof typeof TAGS].label}
        </Badge>
        <div className="flex flex-col gap-2">
          <CardTitle className="font-yoc text-xl">{discussion.title}</CardTitle>
          <div className="font-yoc flex gap-1">
            {discussion.books.slice(0, 3).map((book) => (
              <div
                key={book.id}
                className="bg-dark-gray flex items-center gap-2 rounded-md p-1.5 text-gray-200"
              >
                <Book className="size-4" />
                {book.title}
              </div>
            ))}
            {discussion.books.length > 3 && (
              <div className="bg-dark-gray flex h-20 w-15 items-center justify-center rounded-sm text-sm text-gray-300">
                +{discussion.books.length - 3}
              </div>
            )}
          </div>
        </div>
        {theCurrentUser?.id === discussion.userId && (
          <CardAction className="border-light-gray flex gap-1 rounded-md border">
            <DiscussionDialog type="edit" discussion={discussion} />
            <DeletePost
              postId={discussion.id}
              queryKey="profile-discussions"
              title="هل أنت متأكد من حذف هذا النقاش؟"
            />
          </CardAction>
        )}
      </CardHeader>
      {discussion.content && (
        <CardContent>
          <FormattedText text={discussion.content} />
        </CardContent>
      )}
    </Card>
  );
}
