import Link from "next/link";
import { ASIDE_LINKS } from "./consts";
import { Button } from "@/components/ui/button";

export default function Aside() {
  return (
    <aside className="bg-mid-gray fixed top-1/2 hidden h-fit w-[15%] -translate-y-1/2 flex-col justify-between gap-2 rounded-l-lg px-2 py-4 lg:flex">
      <div className="flex flex-col gap-2">
        <h3 className="px-2.5 font-bold">المكتبة</h3>
        <div className="flex flex-col gap-1.5 rounded-lg">
          {ASIDE_LINKS.books.map(({ name, href, icon: Icon }) => (
            <Button
              key={name}
              nativeButton={false}
              variant={"secondary"}
              className={"justify-start gap-2"}
              render={
                <Link href={href}>
                  <Icon className="size-4" /> {name}
                </Link>
              }
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="px-2.5 font-bold">المجتمع</h3>
        <div className="flex flex-col gap-1.5 rounded-lg">
          {ASIDE_LINKS.community.map(({ name, href, icon: Icon }) => (
            <Button
              key={name}
              nativeButton={false}
              variant={"secondary"}
              className={"justify-start gap-2"}
              render={
                <Link href={href}>
                  <Icon className="size-4" /> {name}
                </Link>
              }
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
