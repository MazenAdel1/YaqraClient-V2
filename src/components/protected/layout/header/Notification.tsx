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

export default function Notification() {
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
          <DropdownMenuItem>قام أحمد بزيارة الصفحة</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
