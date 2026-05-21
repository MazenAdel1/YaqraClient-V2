import { Community, COMMUNITY_KEYS } from "@/components/app/community";
import { PostType } from "@/components/app/community/types";
import { axios } from "@/lib/axios";
import { redirect } from "next/navigation";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ type: PostType }>;
}) {
  const { type } = await searchParams;

  const endpointKey = COMMUNITY_KEYS[type];

  if (!endpointKey) return redirect(`/feed`);

  const { data } = await axios.get(`/community/${endpointKey}?page=1`);

  return <Community initialData={data.result.data} type={type} />;
}
