"use client";

import { TimelinePostProps, SuggestedBooks } from "@/components/app/feed";
import { BookProps } from "@/components/app/shared";
import {
  Discussion,
  DiscussionProps,
} from "@/components/app/shared/posts/discussion";
import {
  Playlist,
  PlaylistProps,
} from "@/components/app/shared/posts/playlist";
import { Review, ReviewProps } from "@/components/app/shared/posts/review";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/axios";
import { useUserStore } from "@/providers/user-store-provider";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const { user: theCurrentUser } = useUserStore();
  const [isFollowings, setIsFollowings] = useState(false);
  const lastElementRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery<TimelinePostProps[]>({
    queryKey: ["timeline", isFollowings],
    queryFn: async ({ pageParam = 1 }) => {
      queryClient.cancelQueries({ queryKey: ["timeline", !isFollowings] });
      const { data } = await axios.get("/timeline", {
        params: {
          Followings: isFollowings,
          page: pageParam,
        },
      });

      return data.result;
    },
    initialPageParam: 1,
    initialData: {
      pageParams: [1],
      pages: [],
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 27) return undefined;
      return allPages.length + 1;
    },
  });

  const renderPosts = () => {
    return (posts.pages.flat() ?? []).map((post, index: number) => {
      if (Array.isArray(post))
        return <SuggestedBooks key={index} books={post as BookProps[]} />;

      if (!post || post.userId === theCurrentUser?.id) return null;

      switch (post.type) {
        case "Playlist":
          return <Playlist key={post.id} playlist={post as PlaylistProps} />;
        case "DiscussionArticleNews":
          return (
            <Discussion key={post.id} discussion={post as DiscussionProps} />
          );
        case "Review":
          return <Review key={post.id} review={post as ReviewProps} />;
        default:
          return null;
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    });

    const lastElement = lastElementRef.current;

    if (lastElement) {
      observer.observe(lastElement);
    }

    return () => {
      if (lastElement) {
        observer.unobserve(lastElement);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetching]);

  return (
    <div className="container flex flex-col gap-12 lg:max-w-2xl">
      <div className="flex w-full gap-2 *:flex-1">
        <Button
          variant={isFollowings ? "outline" : "default"}
          onClick={() => {
            setIsFollowings(false);
          }}
        >
          الافتراضي
        </Button>
        <Button
          variant={isFollowings ? "default" : "outline"}
          onClick={() => {
            setIsFollowings(true);
          }}
        >
          المتابَعين
        </Button>
      </div>
      {isLoading ? (
        <Loader2 className="mx-auto size-8 animate-spin" />
      ) : (
        <section className="flex flex-col gap-10">{renderPosts()}</section>
      )}
      <div className="hidden" ref={lastElementRef} />
      {isFetchingNextPage && (
        <Loader2 className="mx-auto size-8 animate-spin" />
      )}
    </div>
  );
}
