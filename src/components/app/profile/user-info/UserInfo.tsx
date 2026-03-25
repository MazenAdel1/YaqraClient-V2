import Image from "next/image";
import PasswordEditDialog from "./PasswordEditDialog";
import ProfileEditDialog from "./ProfileEditDialog";
import { UserIcon } from "lucide-react";
import FollowDialog from "./FollowDialog";
import FollowButton from "./FollowButton";
import { UserInfoProps } from "./types";

export default function UserInfo({
  userData,
  isTheCurrentUser,
}: UserInfoProps) {
  return (
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
          <h1 className="text-4xl font-bold">{userData?.username}</h1>
          <p className="text-sm text-gray-300">{userData?.bio}</p>
        </section>

        <section className="flex items-center gap-3">
          <FollowDialog type="followings" user={userData} />
          <FollowDialog type="followers" user={userData} />
          {!isTheCurrentUser && <FollowButton user={userData} />}
        </section>
      </div>
    </section>
  );
}
