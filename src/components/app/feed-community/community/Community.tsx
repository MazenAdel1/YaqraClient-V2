"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { CommunityProps, GeneralPostProps } from "./types";
import { axios } from "@/lib/axios";
import { COMMUNITY_KEYS, DISCUSSIONS_FILTERS } from "./consts";
import { Playlist, PlaylistProps } from "../../shared/posts/playlist";
import { Discussion, DiscussionProps } from "../../shared/posts/discussion";
import { Review, ReviewProps } from "../../shared/posts/review";
import { useMemo, useState } from "react";
import { InfiniteQueryResponse } from "@/components/shared";
import { useUserStore } from "@/providers/user-store-provider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Community({ initialData, type }: CommunityProps) {
  const { user: theCurrentUser } = useUserStore();
  const [tag, setTag] = useState("0");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<InfiniteQueryResponse<GeneralPostProps>>({
      queryKey: ["community", type, tag],
      queryFn: async ({ pageParam }) => {
        const endpointKey = COMMUNITY_KEYS[type];
        const { data } = await axios.get(`/community/${endpointKey}`, {
          params: {
            page: pageParam,
            tag: type === "discussions" ? tag : undefined,
          },
        });

        return data.result;
      },
      getNextPageParam: (lastPage) => {
        const hasMore = lastPage.pageNumber < lastPage.totalPages;
        return hasMore ? lastPage.pageNumber + 1 : null;
      },
      initialData: {
        pages: [{ data: initialData, pageNumber: 1, totalPages: 1 }],
        pageParams: [1],
      },
      initialPageParam: 1,
    });

  const RenderPosts = useMemo(() => {
    return (data?.pages.flatMap((page) => page.data) ?? initialData).map(
      (post: GeneralPostProps) => {
        if (post.userId === theCurrentUser?.id) return null;

        switch (post.type) {
          case "Playlist":
            return (
              <Playlist
                key={post.id}
                playlist={post as PlaylistProps}
                queryKey={["community"]}
              />
            );
          case "DiscussionArticleNews":
            return (
              <Discussion
                key={post.id}
                discussion={post as DiscussionProps}
                queryKey={["community"]}
              />
            );
          case "Review":
            return (
              <Review
                key={post.id}
                review={post as ReviewProps}
                queryKey={["community"]}
              />
            );
          default:
            return null;
        }
      },
    );
  }, [data.pages, initialData, theCurrentUser?.id]);

  return (
    <div className="container flex flex-col gap-12 lg:max-w-2xl">
      {type === "discussions" && (
        <Select
          onValueChange={(value) => setTag(value as string)}
          defaultValue={"0"}
          items={DISCUSSIONS_FILTERS}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DISCUSSIONS_FILTERS.map((filter) => (
              <SelectItem
                key={filter.value}
                value={filter.value}
                className="cursor-pointer"
              >
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <section className="flex flex-col gap-10">{RenderPosts}</section>
      {hasNextPage && (
        <Button
          className={"mx-auto w-fit"}
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          variant={"outline"}
        >
          تحميل المزيد
          {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
        </Button>
      )}
    </div>
  );
}
