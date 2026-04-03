import { Button } from "@/components/ui/button";
import { axios } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { LikeProps } from "./types";

export default function Like({ postId, likeCount, isLiked }: LikeProps) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await axios.put(`/community/like?postId=${postId}`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries();

      queryClient.setQueriesData<
        { id: number; likeCount: number; isLiked: boolean }[]
      >(
        { predicate: (query) => Array.isArray(query.state.data) },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((item) =>
            item.id === postId
              ? {
                  ...item,
                  likeCount: isLiked ? item.likeCount - 1 : item.likeCount + 1,
                  isLiked: !isLiked,
                }
              : item,
          );
        },
      );
    },
  });

  return (
    <Button variant="outline" onClick={async () => await mutateAsync()}>
      {likeCount}
      <Heart
        className={cn(isLiked ? "size-4 fill-red-500 text-red-500" : "size-4")}
      />
    </Button>
  );
}
