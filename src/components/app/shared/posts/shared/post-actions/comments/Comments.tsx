import { axios } from "@/lib/axios";
import { CommentProps } from "./types";
import Comment from "./Comment";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InfiniteQueryResponse } from "@/components/shared";
import { useMemo } from "react";

export default function Comments({ postId }: { postId: number }) {
  const {
    data: comments,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<InfiniteQueryResponse<CommentProps>>({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get(
        `/community/postComments?postId=${postId}`,
        {
          params: {
            page: pageParam,
          },
        },
      );

      return data.result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.pageNumber < lastPage.totalPages;
      return hasMore ? lastPage.pageNumber + 1 : null;
    },
  });

  const commentsData = useMemo(
    () => comments?.pages.flatMap((page) => page.data) ?? [],
    [comments],
  );

  if (isLoading) {
    return <Loader2 className="mx-auto size-7 animate-spin" />;
  }

  return (
    <section className="flex flex-col gap-2">
      {commentsData.length > 0 ? (
        commentsData.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-1">
            {!comment.parentCommentId && (
              <Comment key={comment.id} comment={comment} />
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-300">لا توجد تعليقات بعد</p>
      )}
      {hasNextPage && (
        <Button
          variant="outline"
          className={"mx-auto w-fit"}
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          عرض المزيد{" "}
          {isFetchingNextPage && (
            <Loader2 className="mx-auto size-4 animate-spin" />
          )}
        </Button>
      )}
    </section>
  );
}
