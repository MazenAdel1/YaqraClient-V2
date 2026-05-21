"use client";

import { Button } from "@/components/ui/button";
import { ASIDE_LINKS } from "./consts";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CommunityLinks() {
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col gap-1.5 rounded-lg">
      {ASIDE_LINKS.community.map(({ name, href, icon: Icon }) => (
        <Button
          key={name}
          nativeButton={false}
          variant={
            searchParams.get("type") &&
            href.split("type=")[1] === searchParams.get("type")
              ? "default"
              : "secondary"
          }
          className={"justify-start gap-2"}
          render={
            <Link href={href}>
              <Icon className="size-4" /> {name}
            </Link>
          }
        />
      ))}
    </div>
  );
}
