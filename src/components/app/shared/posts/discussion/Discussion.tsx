import { DiscussionProps } from "./types";
import DiscussionDialog from "./DiscussionDialog";
import { Book } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TAGS } from "./consts";
import FormattedText from "../../FormattedText";
import PostWrapper from "../shared/PostWrapper";

export default function Discussion({
  discussion,
}: {
  discussion: DiscussionProps;
}) {
  return (
    <PostWrapper
      editDialog={<DiscussionDialog type="edit" discussion={discussion} />}
      post={discussion}
      queryKey="profile-discussions"
    >
      <Badge variant={"secondary"}>
        {TAGS[discussion.tag as keyof typeof TAGS].label}
      </Badge>
      <div className="flex flex-col gap-2">
        <h1 className="font-yoc text-xl font-semibold">{discussion.title}</h1>
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
      <FormattedText text={discussion.content} />
    </PostWrapper>
  );
}
