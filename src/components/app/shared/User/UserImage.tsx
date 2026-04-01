"use client";

import { UserIcon } from "lucide-react";
import { UserImageProps } from "./types";
import { useUserStore } from "@/providers/user-store-provider";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axios } from "@/lib/axios";
import { UserState } from "@/stores/user-store";
import Link from "next/link";

export default function UserImage({
  id,
  user,
  innavigable = false,
  showName = true,
}: UserImageProps) {
  const [fetchedUserData, setFetchedUserData] = useState<UserState | null>(
    null,
  );
  const { user: theCurrentUser } = useUserStore();

  const isTheCurrentUser = theCurrentUser?.id === id;
  const profilePicture = theCurrentUser?.picture;

  useEffect(() => {
    if (!theCurrentUser && !isTheCurrentUser && !user) {
      (async () => {
        const { data } = await axios.get(`/user/user?userId=${id}`);
        setFetchedUserData({
          picture: data.result.profilePicture,
          username: data.result.username,
        });
      })();
    }
  }, [id, isTheCurrentUser, theCurrentUser, user]);

  const userData = user || fetchedUserData;

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
    <div className="flex items-center gap-2">
      <Link
        href={`/profile/${id}`}
        className="bg-light-gray flex size-10 items-center justify-center rounded-full"
      >
        {avatar}
      </Link>
      {showName && userData?.username && (
        <Link href={`/profile/${id}`} className="mt-1 text-center text-sm">
          {userData?.username}
        </Link>
      )}
    </div>
  );
}
