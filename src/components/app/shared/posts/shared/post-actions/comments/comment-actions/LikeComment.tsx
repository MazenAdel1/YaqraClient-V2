import { Button } from "@/components/ui/button";
import { CommentProps } from "../types";
import { Heart } from "lucide-react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { InfiniteQueryResponse } from "@/components/shared";

export default function LikeComment({ comment }: { comment: CommentProps }) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await axios.put(`/community/likeComment?commentId=${comment.id}`);
    },
    onMutate: async () => {
      const queryKey = ["comments", comment.postId];
      await queryClient.cancelQueries({ queryKey });

      const updateComment = (item: CommentProps): CommentProps => {
        if (!item) return item;

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

      queryClient.setQueriesData<
        InfiniteData<InfiniteQueryResponse<CommentProps>>
      >({ queryKey }, (oldData) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map(updateComment),
          })),
        };
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["comments", comment.postId],
      });
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
