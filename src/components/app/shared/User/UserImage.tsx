"use client";

import { UserIcon } from "lucide-react";
import { UserImageProps } from "./types";
import { useUserStore } from "@/providers/user-store-provider";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axios } from "@/lib/axios";
import { UserState } from "@/stores/user-store";
import { useRouter } from "next/navigation";

export default function UserImage({ id, innavigable = false }: UserImageProps) {
  const [userData, setUserData] = useState<UserState | null>(null);
  const { user } = useUserStore();

  const router = useRouter();

  const isTheCurrentUser = user?.id === id;
  const profilePicture = user?.picture;

  useEffect(() => {
    if (!user && !isTheCurrentUser) {
      (async () => {
        const { data } = await axios.get(`/user/user?userId=${id}`);
        setUserData({
          picture: data.result.profilePicture,
          username: data.result.username,
        });
      })();
    }
  }, [id, isTheCurrentUser, user]);

  const avatar =
    isTheCurrentUser && profilePicture ? (
      <Image
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}${profilePicture}`}
        alt="Profile Picture"
        width={40}
        height={40}
        className="rounded-full"
      />
    ) : userData?.picture ? (
      <Image
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}${userData.picture}`}
        alt="Profile Picture"
        width={40}
        height={40}
        className="rounded-full"
      />
    ) : (
      <UserIcon className="size-5" />
    );

  if (innavigable) {
    return (
      <div className="bg-light-gray flex size-10 items-center justify-center rounded-full">
        {avatar}
      </div>
    );
  }

  return (
    <button
      className="bg-light-gray flex size-10 items-center justify-center rounded-full"
      onClick={() => {
        router.push(`/profile/${id}`);
      }}
    >
      {avatar}
    </button>
  );
}
