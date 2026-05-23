"use client";

import { Discussion, DiscussionProps } from "../../shared/posts/discussion";
import { Playlist, PlaylistProps } from "../../shared/posts/playlist";
import { Review, ReviewProps } from "../../shared/posts/review";
import { GeneralPostProps } from "./types";
import { useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";

const apiEndpointMap = {
  Playlist: "/community/playlist",
  DiscussionArticleNews: "/community/discussion",
  Review: "/community/review",
} as const;

const queryParamMap = {
  Playlist: "playlistId",
  DiscussionArticleNews: "discussionId",
  Review: "reviewId",
} as const;

export default function Post({ post }: { post: GeneralPostProps }) {
  const endpoint = apiEndpointMap[post.type];
  const queryParam = queryParamMap[post.type];

  const { data: postData = post } = useQuery({
    queryKey: ["post", post.id],
    queryFn: async () => {
      const { data } = await axios.get(endpoint, {
        params: { [queryParam]: post.id },
      });
      return data.result as GeneralPostProps;
    },
    initialData: post,
  });

  switch (postData.type) {
    case "Playlist":
      return (
        <div className="container mt-10 flex flex-col gap-12 lg:max-w-2xl">
          <Playlist
            playlist={postData as PlaylistProps}
            queryKey={["post", post.id]}
          />
        </div>
      );
    case "DiscussionArticleNews":
      return (
        <div className="container mt-10 flex flex-col gap-12 lg:max-w-2xl">
          <Discussion
            discussion={postData as DiscussionProps}
            queryKey={["post", post.id]}
          />
        </div>
      );
    case "Review":
      return (
        <div className="container mt-10 flex flex-col gap-12 lg:max-w-2xl">
          <Review
            review={postData as ReviewProps}
            queryKey={["post", post.id]}
          />
        </div>
      );
  }
}
