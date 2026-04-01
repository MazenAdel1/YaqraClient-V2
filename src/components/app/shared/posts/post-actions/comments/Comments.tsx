import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { CommentProps } from "./types";
import Comment from "./Comment";
import { Loader2 } from "lucide-react";

export default function Comments({ postId }: { postId: number }) {
  const { data: comments, isLoading } = useQuery<CommentProps[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/community/postComments?postId=${postId}`,
      );
      return data.result.data;
    },
  });

  if (isLoading) {
    return <Loader2 className="mx-auto size-7 animate-spin" />;
  }

  return (
    <section className="flex flex-col gap-2">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex flex-col gap-1">
          {!comment.parentCommentId && (
            <Comment key={comment.id} comment={comment} />
          )}
        </div>
      ))}
    </section>
  );
}
