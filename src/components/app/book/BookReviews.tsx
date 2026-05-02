"use client";

import { ApiBookProps } from "@/components/app/shared";
import {
  Review,
  ReviewDialog,
  ReviewProps,
} from "@/components/app/shared/posts/review";
import { InfiniteQueryResponse } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export default function BookReviews({
  book,
  initialReviews,
}: {
  book: ApiBookProps;
  initialReviews: ReviewProps[];
}) {
  const {
    data: reviews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<InfiniteQueryResponse<ReviewProps>>({
    queryKey: ["book-reviews", book.id],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get("/book/reviews", {
        params: {
          bookId: book.id,
          page: pageParam,
          sortType: 1,
          sortField: 1,
        },
      });

      return data.result;
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.pageNumber < lastPage.totalPages;
      return hasMore ? lastPage.pageNumber + 1 : null;
    },
    initialData: {
      pages: [{ data: initialReviews, pageNumber: 1, totalPages: 1 }],
      pageParams: [1],
    },
    initialPageParam: 1,
    enabled: true,
  });

  const reviewsData = useMemo(
    () => reviews?.pages.flatMap((page) => page.data) ?? initialReviews,
    [reviews, initialReviews],
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-yoc text-lg sm:text-xl lg:text-2xl">المراجعات</h2>
        <ReviewDialog
          queryKey={["book-reviews", book.id]}
          type="add"
          data={{ book }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {reviewsData.map((review) => (
          <Review
            key={review.id}
            review={{ ...review, book }}
            queryKey={["book-reviews", book.id]}
          />
        ))}
      </div>
      {hasNextPage && (
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          className={"mx-auto w-fit"}
        >
          تحميل المزيد{" "}
          {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
        </Button>
      )}
    </section>
  );
}
