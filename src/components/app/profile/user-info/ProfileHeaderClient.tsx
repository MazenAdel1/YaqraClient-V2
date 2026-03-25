"use client";

import { UserInfo } from "@/components/app/profile/user-info";
import { axios } from "@/lib/axios";
import { useUserStore } from "@/providers/user-store-provider";
import { UserState } from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export default function ProfileHeaderClient({ userId }: { userId: string }) {
  const { user, isHydratingUser } = useUserStore();

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery<UserState>({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/user/user?userId=${userId}`);
      const currentUser = data.result;

      return {
        id: currentUser.userId,
        username: currentUser.username,
        bio: currentUser.bio,
        picture: currentUser.profilePicture,
        followingsCount: currentUser.followingsCount,
        followersCount: currentUser.followersCount,
        isFollowed: currentUser.isFollowed,
      };
    },
    enabled: Boolean(userId),
  });

  const isTheCurrentUser = useMemo(
    () => !isHydratingUser && user?.id === userId,
    [isHydratingUser, user, userId],
  );

  if (Boolean(userId) && (isLoading || isHydratingUser)) {
    return (
      <div className="flex w-full justify-center">
        <Loader2 className="size-20 animate-spin" />
      </div>
    );
  }

  if (isError || !userData) {
    return (
      <p className="text-center text-xl text-gray-300">المستخدم غير موجود</p>
    );
  }

  return <UserInfo userData={userData} isTheCurrentUser={isTheCurrentUser} />;
}
