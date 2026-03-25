"use client";

import { useUserStore } from "@/providers/user-store-provider";
import { UserImage } from "../../shared/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Logout from "./Logout";
import { UserIcon } from "lucide-react";

export default function User() {
  const { user } = useUserStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserImage id={user?.id as string} innavigable />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-sm:w-[calc(100vw-2rem)]! max-sm:min-w-0! sm:w-50"
        align="end"
      >
        <DropdownMenuGroup className="*:w-full">
          <DropdownMenuItem
            nativeButton={false}
            render={
              <Link
                href={`/profile/${user?.id}`}
                className="flex items-center justify-between"
              >
                الملف الشخصي <UserIcon />
              </Link>
            }
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="*:w-full">
          <DropdownMenuItem render={<Logout />} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
