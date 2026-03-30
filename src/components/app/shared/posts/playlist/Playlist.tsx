import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useUserStore } from "@/providers/user-store-provider";
import { PlaylistProps } from "./types";
import PlaylistDialog from "./PlaylistDialog";
import { UserImage } from "../../user";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import { Book } from "lucide-react";
import DeletePost from "../shared/DeletePost";
import FormattedText from "../../FormattedText";
import PostActionWrapper from "../post-actions/PostActionWrapper";

export default function Playlist({ playlist }: { playlist: PlaylistProps }) {
  const { user: theCurrentUser } = useUserStore();

  return (
    <Card>
      <PostActionWrapper
        postId={playlist.id}
        isLiked={playlist.isLiked}
        likeCount={playlist.likeCount}
      >
        <CardHeader className="gap-4">
          <div className="flex items-center gap-2">
            <UserImage id={playlist.userId} />
            <div className="flex flex-col gap-0.5">
              <Link href={`/profile/${playlist.userId}`}>
                {playlist.username}
              </Link>
              <span className="text-[10px] text-gray-300">
                {timeAgo(playlist.createdDate)}
              </span>
            </div>
          </div>
          <CardTitle className="text-lg">{playlist.title}</CardTitle>
          <div className="grid grid-cols-2">
            {playlist.books.map((book) => (
              <div key={book.id} className="flex items-center gap-2">
                <div className="bg-dark-gray flex h-20 w-15 items-center justify-center overflow-hidden rounded-sm">
                  {book.image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SERVER_URL}${book.image}`}
                      alt={book.title}
                      width={50}
                      height={74}
                      className="size-full"
                    />
                  ) : (
                    <Book className="size-6" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="flex items-center gap-2">
                    <span className="font-yoc text-lg font-medium text-gray-300">
                      {book.title}
                    </span>{" "}
                  </h2>
                </div>
              </div>
            ))}
          </div>
          {theCurrentUser?.id === playlist.userId && (
            <CardAction className="border-light-gray flex gap-1 rounded-md border">
              <PlaylistDialog type="edit" playlist={playlist} />
              <DeletePost
                postId={playlist.id}
                queryKey="profile-playlists"
                title="هل أنت متأكد من حذف هذه القائمة"
              />
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <FormattedText text={playlist.content} />
        </CardContent>
      </PostActionWrapper>
    </Card>
  );
}
