import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ASIDE_LINKS } from "../aside/consts";

export default function MobileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="lg:hidden"
        render={
          <Button
            size={"icon-lg"}
            variant={"secondary"}
            className={"rounded-full"}
          >
            <Menu className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className={
          "max-sm:w-[calc(100vw-2rem)]! max-sm:min-w-0! sm:w-xs lg:hidden"
        }
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>المكتبة</DropdownMenuLabel>
          {ASIDE_LINKS.books.map(({ name, href, icon: Icon }) => (
            <DropdownMenuItem
              key={name}
              render={
                <Link href={href}>
                  <Icon className="size-4" /> {name}
                </Link>
              }
            />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>المجتمع</DropdownMenuLabel>
          {ASIDE_LINKS.community.map(({ name, href, icon: Icon }) => (
            <DropdownMenuItem
              key={name}
              render={
                <Link href={href}>
                  <Icon className="size-4" /> {name}
                </Link>
              }
            />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
