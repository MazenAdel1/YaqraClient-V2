"use client";

import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks";
import { useState, useRef, useEffect } from "react";
import { BookIcon, Loader2, SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import Image from "next/image";
import { BookProps } from "../shared";

export default function BookFinderSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const minLength = 2;
  const canSearch = query.trim().length >= minLength;
  const debouncedQuery = useDebounce(query, 300) as string;

  const { data: results = [], isFetching } = useQuery<BookProps[]>({
    queryKey: ["book-finder-search", debouncedQuery.trim().toLowerCase()],
    queryFn: async () => {
      const { data } = await axios.get("/book/title", {
        params: { bookTitle: debouncedQuery },
      });
      const items = data?.result?.data ?? data?.result ?? [];
      return items;
    },
    enabled: canSearch,
    staleTime: 60_000,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          {isFetching ? (
            <Loader2 className="text-muted-foreground size-4 animate-spin" />
          ) : (
            <SearchIcon className="size-4" />
          )}
        </InputGroupAddon>
        <InputGroupInput
          placeholder="البحث عن كتاب"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </InputGroup>

      {showDropdown && (
        <div className="border-border bg-popover absolute z-50 mt-1 w-full rounded-md border shadow-md">
          {!canSearch ? (
            <p className="text-muted-foreground px-3 py-2 text-sm">
              اكتب حرفين على الأقل للبحث
            </p>
          ) : isFetching ? (
            <div className="text-muted-foreground flex items-center gap-2 px-3 py-2 text-sm">
              <Loader2 className="size-4 animate-spin" />
              جاري البحث...
            </div>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground px-3 py-2 text-sm">
              لا توجد نتائج
            </p>
          ) : (
            <ul className="max-h-60 overflow-y-auto py-1">
              {results.map((book) => (
                <li key={book.id}>
                  <Link
                    href={`/book/${book.id}`}
                    className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 px-3 py-2 text-sm transition-colors"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    {book.image ? (
                      <Image
                        width={20}
                        height={30}
                        alt={book.title}
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}${book.image}`}
                        className="rounded-xs"
                      />
                    ) : (
                      <BookIcon className="size-5" />
                    )}
                    <p>{book.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
