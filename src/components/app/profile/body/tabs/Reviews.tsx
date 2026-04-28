"use client";

import { axios } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/providers/user-store-provider";
import {
  ReviewProps,
  Review,
  ReviewDialog,
} from "@/components/app/shared/posts/review";
import { InfiniteQueryResponse } from "@/components/shared";
import { useCallback, useMemo } from "react";

const QUERY_KEY = "profile-reviews";

export default function Reviews({ userId }: { userId: string }) {
  const { user: theCurrentUser } = useUserStore();

  const {
    data: reviews,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<InfiniteQueryResponse<ReviewProps>>({
    queryKey: [QUERY_KEY, userId],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get("/community/userReviews", {
        params: {
          userId,
          page: pageParam,
        },
      });

      return data.result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.pageNumber < lastPage.totalPages;
      return hasMore ? lastPage.pageNumber + 1 : null;
    },
    enabled: Boolean(userId),
  });

  const reviewsData = useMemo(
    () => reviews?.pages.flatMap((page) => page.data) ?? [],
    [reviews],
  );

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting) return;
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        },
        { rootMargin: "200px 0px", threshold: 0 },
      );

      observer.observe(node);

      return () => observer.disconnect();
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-8">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-gray-300">تعذر تحميل المراجعات</p>;
  }

  return (
    <section className="flex flex-col gap-12">
      {theCurrentUser?.id === userId && (
        <ReviewDialog type="add" queryKey={[QUERY_KEY, userId]} />
      )}
      {reviewsData.length > 0 ? (
        reviewsData.map((review) => (
          <Review
            key={review.id}
            review={review}
            queryKey={[QUERY_KEY, userId]}
          />
        ))
      ) : (
        <p className="text-center text-gray-300">لا توجد مراجعات بعد</p>
      )}
      <div ref={sentinelRef} className="h-px w-full" />
      {isFetchingNextPage && (
        <Loader2 className="mx-auto size-8 animate-spin" />
      )}
    </section>
  );
}
