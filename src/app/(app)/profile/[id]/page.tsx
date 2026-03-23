"use client";

import FollowButton from "@/components/app/profile/FollowButton";
import FollowDialog from "@/components/app/profile/FollowDialog";
import PasswordEditDialog from "@/components/app/profile/PasswordEditDialog";
import ProfileEditDialog from "@/components/app/profile/ProfileEditDialog";
import { axios } from "@/lib/axios";
import { useUserStore } from "@/providers/user-store-provider";
import { UserState } from "@/stores/user-store";
import { useQuery } from "@tanstack/react-query";
import { Loader2, UserIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserStore();

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery<UserState>({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data } = await axios.get(`/user/user?userId=${id}`);
      const user = data.result;

      return {
        id: user.userId,
        username: user.username,
        bio: user.bio,
        picture: user.profilePicture,
        followingsCount: user.followingsCount,
        followersCount: user.followersCount,
        isFollowed: user.isFollowed,
      };
    },
    enabled: Boolean(id),
  });

  const isTheCurrentUser = useMemo(() => user?.id === id, [user, id]);

  if (Boolean(id) && isLoading) {
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

  return (
    <div>
      <section className="flex items-center justify-center gap-5">
        {isTheCurrentUser && (
          <section className="flex flex-col gap-1">
            <ProfileEditDialog
              defaultValues={{
                pic: userData.picture
                  ? `${process.env.NEXT_PUBLIC_SERVER_URL}/${userData.picture}`
                  : undefined,
                userName: userData.username,
                userBio: userData.bio,
              }}
            />
            <PasswordEditDialog />
          </section>
        )}
        {userData?.picture ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${userData.picture}`}
            alt="Profile Picture"
            width={200}
            height={200}
            className="size-50 rounded-full border-2 border-white/75 object-cover object-top"
          />
        ) : (
          <div className="bg-mid-gray border-light-gray flex size-50 items-center justify-center rounded-full border">
            <UserIcon className="size-40 text-white/85" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <section className="flex flex-col">
            <h1 className="font-yoc text-4xl font-bold">
              {userData?.username}
            </h1>
            <p className="text-sm text-gray-300">{userData?.bio}</p>
          </section>

          <section className="flex items-center gap-3">
            <FollowDialog type="followings" user={userData} />
            <FollowDialog type="followers" user={userData} />
            {!isTheCurrentUser && <FollowButton user={userData} />}
          </section>
        </div>
      </section>
    </div>
  );
}
