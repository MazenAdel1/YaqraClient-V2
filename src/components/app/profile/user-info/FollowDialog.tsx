"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FollowDialogProps, FollowItem } from "./types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { InfiniteQueryResponse } from "@/components/shared";

export default function FollowDialog({ type, user }: FollowDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options = {
    followings: {
      buttonLabel: "يتابع",
      value: user.followingsCount,
      title: "قائمة المتابِعين",
    },
    followers: {
      buttonLabel: "يتابعه",
      value: user.followersCount,
      title: "قائمة المتابَعين",
    },
  };

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery<InfiniteQueryResponse<FollowItem>>({
    queryKey: ["profile", user.id, type],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get(`/user/${type}?userId=${user.id}`, {
        params: {
          page: pageParam,
        },
      });
      return data.result;
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.pageNumber < lastPage.totalPages;
      return hasMore ? lastPage.pageNumber + 1 : undefined;
    },
    enabled: isOpen && Boolean(user.id),
  });

  const followData = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant={"outline"} className={"w-20"}>
            {options[type].buttonLabel} {options[type].value}
          </Button>
        }
      />
      <DialogContent className="max-h-[80dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{options[type].title}</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex w-full justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {!isLoading && isError && (
          <div className="text-sm text-red-300">
            حدث خطأ أثناء تحميل البيانات
          </div>
        )}

        {!isLoading && !isError && followData.length === 0 && (
          <div className="text-sm text-gray-300">لا يوجد بيانات لعرضها</div>
        )}

        {!isLoading && !isError && followData.length > 0 && (
          <div className="flex flex-col">
            {followData.map((item) => (
              <Link
                href={`/profile/${item.userId}`}
                key={item.userId}
                className={
                  "border-light-gray hover:bg-dark-gray flex items-center gap-3 rounded-lg border p-2"
                }
              >
                {item.username}
              </Link>
            ))}

            {hasNextPage && (
              <Button
                variant="outline"
                className="mt-3"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                تحميل المزيد{" "}
                {isFetchingNextPage && (
                  <Loader2 className="mx-auto size-4 animate-spin" />
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
