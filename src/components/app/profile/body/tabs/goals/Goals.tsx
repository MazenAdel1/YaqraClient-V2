"use client";

import { axios } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/providers/user-store-provider";
import { GoalProps } from "./types";
import Goal from "./Goal";
import GoalDialog from "./GoalDialog";
import { InfiniteQueryResponse } from "@/components/shared";
import { useCallback, useMemo } from "react";

const QUERY_KEY = "profile-goals";

export default function Goals({ userId }: { userId: string }) {
  const { user: theCurrentUser } = useUserStore();

  const {
    data: goals,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<InfiniteQueryResponse<GoalProps>>({
    queryKey: [QUERY_KEY, userId],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get(`/user/allGoals`, {
        params: { userId, page: pageParam },
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

  const goalsData = useMemo(
    () => goals?.pages.flatMap((page) => page.data) ?? [],
    [goals],
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
    return <p className="text-center text-gray-300">تعذر تحميل الأهداف</p>;
  }

  return (
    <section className="flex flex-col gap-12">
      {theCurrentUser?.id === userId && <GoalDialog type="add" />}
      {goalsData.length > 0 ? (
        goalsData.map((goal: GoalProps) => <Goal key={goal.id} goal={goal} />)
      ) : (
        <p className="text-center text-gray-300">لا توجد أهداف بعد</p>
      )}
      <div ref={sentinelRef} className="h-px w-full" />
      {isFetchingNextPage && (
        <Loader2 className="mx-auto size-8 animate-spin" />
      )}
    </section>
  );
}
