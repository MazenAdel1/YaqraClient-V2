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
  additionalInfo,
}: UserImageProps) {
  const [fetchedUserData, setFetchedUserData] = useState<UserState | null>(
    null,
  );
  const { user: theCurrentUser } = useUserStore();

  const isTheCurrentUser = theCurrentUser?.id === id;
  const profilePicture = theCurrentUser?.picture;

  useEffect(() => {
    if (isTheCurrentUser || user) return;

    let isMounted = true;

    (async () => {
      const { data } = await axios.get(`/user/user?userId=${id}`);
      if (!isMounted) return;

      setFetchedUserData({
        picture: data.result.profilePicture,
        username: data.result.username,
      });
    })();

    return () => {
      isMounted = false;
    };
  }, [id, isTheCurrentUser, user]);

  const currentUserData = isTheCurrentUser
    ? {
        picture: profilePicture,
        username: theCurrentUser?.username || "",
      }
    : null;

  // to match the user type and kick away the mismatch between the server response and client types
  const correctedUser = user && { ...user, picture: user.profilePicture };

  const userData = correctedUser || currentUserData || fetchedUserData;

  const avatar = userData?.picture ? (
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
      <div className="flex flex-col gap-0.5">
        {userData?.username && (
          <Link href={`/profile/${id}`} className="mt-1 text-center text-sm">
            {userData?.username}
          </Link>
        )}
        {additionalInfo && (
          <span className="text-[10px] text-gray-300">{additionalInfo}</span>
        )}
      </div>
    </div>
  );
}
