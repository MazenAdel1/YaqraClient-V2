import { TimelinePostProps } from "@/components/app/feed";
import { Feed } from "@/components/app/feed";
import { axios } from "@/lib/axios";

export default async function Page() {
  const { data } = await axios.get("/timeline", {
    params: {
      Followings: false,
      page: 1,
    },
  });

  return <Feed initialData={data.result as TimelinePostProps[]} />;
}
