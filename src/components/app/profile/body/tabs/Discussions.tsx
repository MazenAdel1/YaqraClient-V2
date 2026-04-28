"use client";

import { axios } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/providers/user-store-provider";
import {
  Discussion,
  DiscussionDialog,
  DiscussionProps,
} from "@/components/app/shared/posts/discussion";
import { InfiniteQueryResponse } from "@/components/shared";
import { useCallback, useMemo } from "react";

const QUERY_KEY = "profile-discussions";

export default function Discussions({ userId }: { userId: string }) {
  const { user: theCurrentUser } = useUserStore();

  const {
    data: discussions,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<InfiniteQueryResponse<DiscussionProps>>({
    queryKey: [QUERY_KEY, userId],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get("/community/userDiscussions", {
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

  const discussionsData = useMemo(
    () => discussions?.pages.flatMap((page) => page.data) ?? [],
    [discussions],
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
    return <p className="text-center text-gray-300">تعذر تحميل النقاشات</p>;
  }

  return (
    <section className="flex flex-col gap-12">
      {theCurrentUser?.id === userId && (
        <DiscussionDialog type="add" queryKey={[QUERY_KEY, userId]} />
      )}
      {discussionsData.length > 0 ? (
        discussionsData.map((discussion) => (
          <Discussion
            key={discussion.id}
            discussion={discussion}
            queryKey={[QUERY_KEY, userId]}
          />
        ))
      ) : (
        <p className="text-center text-gray-300">لا يوجد نقاشات بعد</p>
      )}
      <div ref={sentinelRef} className="h-px w-full" />
      {isFetchingNextPage && (
        <Loader2 className="mx-auto size-8 animate-spin" />
      )}
    </section>
  );
}
