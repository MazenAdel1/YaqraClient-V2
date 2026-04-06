"use client";

import { UserIcon } from "lucide-react";
import { UserImageProps } from "./types";
import { useUserStore } from "@/providers/user-store-provider";
import Image from "next/image";
import { axios } from "@/lib/axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

export default function UserImage({
  id,
  user,
  innavigable = false,
  additionalInfo,
}: UserImageProps) {
  const { user: theCurrentUser } = useUserStore();
  const isTheCurrentUser = theCurrentUser?.id === id;

  const { data: userData } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      if (isTheCurrentUser) {
        return {
          picture: theCurrentUser?.picture,
          username: theCurrentUser?.username || "",
        };
      }

      if (user) {
        return {
          picture: user.profilePicture,
          username: user.username,
        };
      }

      const { data } = await axios.get(`/user/user?userId=${id}`);
      return {
        picture: data.result.profilePicture,
        username: data.result.username,
      };
    },
    enabled: !isTheCurrentUser && !user,
  });

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
