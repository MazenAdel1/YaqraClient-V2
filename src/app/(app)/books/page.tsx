import { ApiBookProps, BookCard } from "@/components/app/shared";
import { BookFinderPagination } from "@/components/app/book-finder";
import { InfiniteQueryResponse } from "@/components/shared";
import { axios } from "@/lib/axios";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type BookType = "trending" | "recommendations" | "recent" | "upcoming";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{
    type: BookType;
    page?: string;
  }>;
}) {
  const { type, page } = await searchParams;

  if (page && (Number(page) < 1 || !Number.isInteger(Number(page))))
    return redirect(`/books?type=${type}`);

  if (
    !searchParams ||
    !type ||
    (type !== "recent" &&
      type !== "trending" &&
      type !== "recommendations" &&
      type !== "upcoming")
  )
    return redirect(`/books?type=recommendations`);

  const { data } = await axios.get(`/book/${type}`, {
    params: page ? { page } : undefined,
  });

  const result: ApiBookProps[] | InfiniteQueryResponse<ApiBookProps> =
    data.result;

  const isPaginated = !Array.isArray(result);
  const books = isPaginated
    ? (result as InfiniteQueryResponse<ApiBookProps>).data
    : (result as ApiBookProps[]);

  return (
    <main className="container flex flex-col gap-5">
      {isPaginated && (
        <BookFinderPagination
          data={result as InfiniteQueryResponse<ApiBookProps>}
          page={page}
          query={`type=${type}`}
          basePath={`/books`}
        />
      )}
      {books.length > 0 ? (
        <div className="grid-layout-3">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Button
            nativeButton={false}
            variant={"secondary"}
            className={"w-fit"}
            render={
              <Link href={"/feed"}>
                <ArrowRight /> الرجوع
              </Link>
            }
          />
          <h4 className="text-xl">لا يوجد كتب حاليا</h4>
        </div>
      )}
    </main>
  );
}
