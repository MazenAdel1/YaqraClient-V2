import { Button } from "@/components/ui/button";
import { TimelinePostProps } from "@/components/app/feed";
import { axios } from "@/lib/axios";
import { cn } from "@/lib/utils";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { LikeProps } from "./types";

export default function Like({ postId, likeCount, isLiked }: LikeProps) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await axios.put(`/community/like?postId=${postId}`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["timeline"] });

      const previousTimelineQueries = queryClient.getQueriesData<
        InfiniteData<TimelinePostProps[]>
      >({ queryKey: ["timeline"] });

      queryClient.setQueriesData<InfiniteData<TimelinePostProps[]>>(
        { queryKey: ["timeline"] },
        (oldData) => {
          if (!oldData?.pages) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.map((item) => {
                if (!item || Array.isArray(item) || item.id !== postId) {
                  return item;
                }

                return {
                  ...item,
                  likeCount: item.isLiked
                    ? Math.max(0, item.likeCount - 1)
                    : item.likeCount + 1,
                  isLiked: !item.isLiked,
                };
              }),
            ),
          };
        },
      );

      return { previousTimelineQueries };
    },
    onError: (_error, _variables, context) => {
      context?.previousTimelineQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["timeline"] });
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
