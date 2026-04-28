import { Button } from "@/components/ui/button";
import { axios } from "@/lib/axios";
import { cn } from "@/lib/utils";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { LikeProps } from "./types";

type LikablePost = { id: number; likeCount: number; isLiked: boolean };

function toggleLike<T extends LikablePost>(item: T, postId: number): T {
  if (item.id !== postId) return item;
  return {
    ...item,
    likeCount: item.isLiked
      ? Math.max(0, item.likeCount - 1)
      : item.likeCount + 1,
    isLiked: !item.isLiked,
  };
}

export default function Like({
  postId,
  likeCount,
  isLiked,
  queryKey,
}: LikeProps) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await axios.put(`/community/like?postId=${postId}`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueriesData<InfiniteData<any>>({ queryKey }, (oldData) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: unknown) => {
            // Feed timeline shape: page is a flat array of posts
            if (Array.isArray(page)) {
              return page.map((item) => {
                if (!item || Array.isArray(item)) return item;
                return toggleLike(item, postId);
              });
            }

            // Paginated shape: page is { data: Post[], pageNumber, totalPages }
            if (
              page &&
              typeof page === "object" &&
              "data" in page &&
              Array.isArray((page as { data: unknown[] }).data)
            ) {
              const p = page as { data: LikablePost[] };
              return {
                ...p,
                data: p.data.map((item) => toggleLike(item, postId)),
              };
            }

            return page;
          }),
        };
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
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
