"use client";

import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/providers/user-store-provider";
import { GoalProps } from "./types";
import Goal from "./Goal";
import GoalDialog from "./GoalDialog";

export default function Goals({ userId }: { userId: string }) {
  const { user: theCurrentUser } = useUserStore();

  const {
    data: goals,
    isLoading,
    isError,
  } = useQuery<GoalProps[]>({
    queryKey: ["profile-goals", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/user/allGoals`, {
        params: { userId },
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
    return <p className="text-center text-gray-300">تعذر تحميل الأهداف</p>;
  }

  return (
    <section className="flex flex-col gap-2">
      {theCurrentUser?.id === userId && <GoalDialog type="add" />}
      {goals && goals.length > 0 ? (
        goals.map((goal: GoalProps) => <Goal key={goal.id} goal={goal} />)
      ) : (
        <p className="text-center text-gray-300">لا توجد أهداف بعد</p>
      )}
    </section>
  );
}
