"use client";

import { ApiBookProps, BookCard } from "@/components/app/shared";
import { InfiniteQueryResponse } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { AuthorProps } from "./type";

export default function AuthorBooks({
  author,
  initialBooks,
}: {
  author: AuthorProps;
  initialBooks: ApiBookProps[];
}) {
  const {
    data: books,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<InfiniteQueryResponse<ApiBookProps>>({
    queryKey: ["author-books", author.id],
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get("/author/books", {
        params: {
          authorId: author.id,
          page: pageParam,
        },
      });

      return data.result;
    },
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.pageNumber < lastPage.totalPages;
      return hasMore ? lastPage.pageNumber + 1 : null;
    },
    initialData: {
      pages: [{ data: initialBooks, pageNumber: 1, totalPages: 1 }],
      pageParams: [1],
    },
    initialPageParam: 1,
  });

  const booksData = useMemo(
    () => books?.pages.flatMap((page) => page.data) ?? initialBooks,
    [books, initialBooks],
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-yoc text-lg sm:text-xl lg:text-2xl">الكتب</h2>
      </div>

      <div className="grid-layout-3">
        {booksData.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>
      {hasNextPage && (
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          className={"mx-auto w-fit"}
        >
          تحميل المزيد{" "}
          {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
        </Button>
      )}
    </section>
  );
}
