import { UserState } from "@/stores/user-store";

export type FollowDialogProps = {
  type: "followers" | "followings";
  user: UserState;
};

type FollowItem = {
  userId: string;
  username: string;
};

export type FollowApiResult = {
  data: FollowItem[];
  pageNumber: number;
  totalPages: number;
};
