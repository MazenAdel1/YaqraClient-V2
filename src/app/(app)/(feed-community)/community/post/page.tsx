import { axios } from "@/lib/axios";
import { notFound } from "next/navigation";
import { GeneralPostProps } from "@/components/app/feed-community/community/types";
import { Post } from "@/components/app/feed-community/community";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  let postId: string | undefined;
  let apiType: string | undefined;
  let queryKey: string | undefined;

  if (params.reviewId) {
    postId = params.reviewId;
    apiType = "review";
    queryKey = "reviewId";
  } else if (params.discussionId) {
    postId = params.discussionId;
    apiType = "discussion";
    queryKey = "discussionId";
  } else if (params.playlistId) {
    postId = params.playlistId;
    apiType = "playlist";
    queryKey = "playlistId";
  }

  if (!postId || !apiType || !queryKey) {
    return notFound();
  }

  const { data } = await axios.get(`/community/${apiType}`, {
    params: { [queryKey]: postId },
  });

  const post = data.result as GeneralPostProps;

  if (!post) return notFound();

  return <Post post={post} />;
}
