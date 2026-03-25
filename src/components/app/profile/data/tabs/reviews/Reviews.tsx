"use client";

import { ReviewProps } from "@/components/app/shared/posts/review";

import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/providers/user-store-provider";
import { Review, ReviewDialog } from "@/components/app/shared/posts/review";

export default function Reviews({ userId }: { userId: string }) {
  const { user: theCurrentUser } = useUserStore();

  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery<ReviewProps[]>({
    queryKey: ["profile-reviews", userId, 1],
    queryFn: async () => {
      const { data } = await axios.get("/community/userReviews", {
        params: {
          userId,
          page: 1,
        },
      });

      return data.result.data;
    },
    enabled: Boolean(userId),
  });

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
    <section className="flex flex-col gap-2">
      {theCurrentUser?.id === userId && <ReviewDialog type="add" />}
      {reviews && reviews.length > 0 ? (
        reviews.map((review: ReviewProps) => (
          <Review key={review.id} review={review} />
        ))
      ) : (
        <p className="text-center text-gray-300">لا توجد مراجعات بعد</p>
      )}
    </section>
  );
}
