"use client";

import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/providers/user-store-provider";
import {
  Playlist,
  PlaylistDialog,
  PlaylistProps,
} from "@/components/app/shared/posts/playlist";

export default function Playlists({ userId }: { userId: string }) {
  const { user: theCurrentUser } = useUserStore();

  const {
    data: playlists,
    isLoading,
    isError,
  } = useQuery<PlaylistProps[]>({
    queryKey: ["profile-playlists", userId, 1],
    queryFn: async () => {
      const { data } = await axios.get("/community/userPlaylists", {
        params: {
          userId,
          page: 1,
        },
      });

      return data.result.data;
    },
    enabled: Boolean(userId),
  });

  if (isLoading) {
    return (
      <div className="flex w-full justify-center py-8">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-gray-300">تعذر تحميل القوائم</p>;
  }

  return (
    <section className="flex flex-col gap-2">
      {theCurrentUser?.id === userId && <PlaylistDialog type="add" />}
      {playlists && playlists.length > 0 ? (
        playlists.map((playlist: PlaylistProps) => (
          <Playlist key={playlist.id} playlist={playlist} />
        ))
      ) : (
        <p className="text-center text-gray-300">لا توجد قوائم بعد</p>
      )}
    </section>
  );
}
