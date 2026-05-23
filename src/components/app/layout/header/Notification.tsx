"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { axios } from "@/lib/axios";
import { NotificationProps } from "./types";
import * as SignalR from "@microsoft/signalr";
import { useUserStore } from "@/providers/user-store-provider";
import { cn, timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PostType } from "../../shared/posts/shared/types";

export default function Notification() {
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/notification/all", {
        params: {
          page: 1,
        },
      });
      setNotifications(data.result);
    })();
  }, []);

  useEffect(() => {
    if (!user?.token) return;

    const connection = new SignalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_SERVER_URL}/Notification`, {
        accessTokenFactory: () => user.token as string,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification: NotificationProps) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
    });

    connection.start();

    return () => {
      if (connection.state !== SignalR.HubConnectionState.Disconnected) {
        connection.stop();
      }
    };
  }, [user?.token]);

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className={"size-10 rounded-full"}>
            <Bell className="size-5" />
          </Button>
        }
      />

      <DropdownMenuContent
        align="end"
        className="max-sm:w-[calc(100vw-2rem)]! max-sm:min-w-0! sm:w-xs"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className={"font-yoc"}>
            الاشعارات
          </DropdownMenuLabel>
          <DropdownMenuGroup className="flex flex-col gap-2">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="justify-between"
                nativeButton={true}
                render={
                  <Button
                    variant={notification.isAck ? "ghost" : "outline"}
                    className="relative w-full"
                    onClick={async () => {
                      if (!notification.isAck) {
                        await axios.put(
                          `/notification/?notificationId=${notification.id}`,
                        );
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === notification.id
                              ? { ...n, isAck: true }
                              : n,
                          ),
                        );
                      }

                      const typeMap: Record<PostType, string> = {
                        Review: "reviewId",
                        DiscussionArticleNews: "discussionId",
                        Playlist: "playlistId",
                      };

                      const queryKey =
                        typeMap[notification.postType as PostType];
                      router.push(
                        `/community/post?${queryKey}=${notification.postId}`,
                      );
                    }}
                  >
                    {!notification.isAck && (
                      <span className="bg-primary absolute -top-1 -left-1 size-2 rounded-full" />
                    )}

                    <p
                      className={cn(
                        notification.isAck
                          ? "text-muted-foreground"
                          : "font-medium",
                      )}
                    >
                      {notification.message}
                    </p>
                    <span className="text-muted-foreground text-xs">
                      {timeAgo(notification.createdDate.toString())}
                    </span>
                  </Button>
                }
              />
            ))}
          </DropdownMenuGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
