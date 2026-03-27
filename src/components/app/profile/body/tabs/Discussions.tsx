"use client";

import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/providers/user-store-provider";
import {
  Discussion,
  DiscussionDialog,
  DiscussionProps,
} from "@/components/app/shared/posts/discussion";

export default function Discussions({ userId }: { userId: string }) {
  const { user: theCurrentUser } = useUserStore();

  const {
    data: discussions,
    isLoading,
    isError,
  } = useQuery<DiscussionProps[]>({
    queryKey: ["profile-discussions", userId, 1],
    queryFn: async () => {
      const { data } = await axios.get("/community/userDiscussions", {
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
    return <p className="text-center text-gray-300">تعذر تحميل النقاشات</p>;
  }

  return (
    <section className="flex flex-col gap-2">
      {theCurrentUser?.id === userId && <DiscussionDialog type="add" />}
      {discussions && discussions.length > 0 ? (
        discussions.map((discussion: DiscussionProps) => (
          <Discussion key={discussion.id} discussion={discussion} />
        ))
      ) : (
        <p className="text-center text-gray-300">لا يوجد نقاشات بعد</p>
      )}
    </section>
  );
}
