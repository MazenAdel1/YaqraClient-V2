import { PlaylistProps } from "./types";
import PlaylistDialog from "./PlaylistDialog";
import Image from "next/image";
import { Book } from "lucide-react";
import FormattedText from "../../FormattedText";
import PostWrapper from "../shared/PostWrapper";

export default function Playlist({ playlist }: { playlist: PlaylistProps }) {
  return (
    <PostWrapper
      editDialog={<PlaylistDialog type="edit" playlist={playlist} />}
      post={playlist}
      queryKey="profile-playlists"
    >
      <h1 className="text-lg">{playlist.title}</h1>
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
      <FormattedText text={playlist.content} />
    </PostWrapper>
  );
}
