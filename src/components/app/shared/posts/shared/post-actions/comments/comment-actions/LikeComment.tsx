import { Button } from "@/components/ui/button";
import { CommentProps } from "../types";
import { Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { cn } from "@/lib/utils";

export default function LikeComment({ comment }: { comment: CommentProps }) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await axios.put(`/community/likeComment?commentId=${comment.id}`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries();

      const updateComment = (item: CommentProps): CommentProps => {
        if (item.id === comment.id) {
          return {
            ...item,
            likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
            isLiked: !item.isLiked,
          };
        }
        if (item.replies?.length) {
          return {
            ...item,
            replies: item.replies.map(updateComment),
          };
        }
        return item;
      };

      queryClient.setQueriesData<CommentProps[]>(
        { predicate: (query) => Array.isArray(query.state.data) },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(updateComment);
        },
      );
    },
  });
  return (
    <Button
      variant={"ghost"}
      size={"xs"}
      onClick={async () => await mutateAsync()}
    >
      {comment.likeCount}{" "}
      <Heart
        className={cn("size-3", comment.isLiked && "fill-red-500 text-red-500")}
      />
    </Button>
  );
}
