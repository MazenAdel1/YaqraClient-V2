import { UserState } from "@/stores/user-store";

export type FollowDialogProps = {
  type: "followers" | "followings";
  user: UserState;
};

export type FollowItem = {
  userId: string;
  username: string;
};

export type UserInfoProps = {
  userData: UserState;
  isTheCurrentUser: boolean;
};
