"use client";

import { Form, FormProps } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, useLayoutEffect, useRef, useState } from "react";
import { FINDER_DEFAULT_VALUES, FINDER_INPUTS, FINDER_SCHEMA } from "./consts";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookFinderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit: FormProps<typeof FINDER_SCHEMA>["onSubmit"] = (data) => {
    const q = new URLSearchParams();
    data.AuthorIds.forEach((id) => q.append("AuthorIds", String(id)));
    data.GenreIds.forEach((id) => q.append("GenreIds", String(id)));
    if (data.MinimumRate > 0) {
      q.append("MinimumRate", data.MinimumRate.toString());
    }
    if (q.toString()) router.push(`?${q.toString()}`);
  };

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(typeof window !== "undefined" && window.innerWidth >= 1024);
  }, []);

  return (
    <>
      <aside
        className={cn(
          "container flex w-full flex-col gap-2 lg:fixed lg:right-2 lg:mb-0 lg:w-[20%] lg:gap-4 xl:w-[15%]",
          isOpen && "mb-10",
        )}
      >
        <Button
          variant={"secondary"}
          className="mb-4 lg:hidden"
          size={"icon-sm"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="size-4" /> : <Filter className="size-4" />}
        </Button>
        <Activity mode={isOpen ? "visible" : "hidden"}>
          <Form
            schema={FINDER_SCHEMA}
            inputs={FINDER_INPUTS}
            onSubmit={onSubmit}
            submitLabel="البحث"
            className="w-full flex-row flex-wrap items-end *:flex-1 lg:flex-col lg:*:w-full [&_button]:flex-none [&_input[type='range']]:min-w-40"
            defaultValues={FINDER_DEFAULT_VALUES}
            ref={formRef}
          />
          {searchParams.size > 0 && (
            <Button
              nativeButton={false}
              variant="destructive"
              render={
                <Link href="/book-finder" className={"w-full"}>
                  مسح
                </Link>
              }
            />
          )}
        </Activity>
      </aside>
    </>
  );
}
