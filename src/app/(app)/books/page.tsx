import { ApiBookProps, BookCard } from "@/components/app/shared";
import { BookFinderPagination } from "@/components/app/book-finder";
import { InfiniteQueryResponse } from "@/components/shared";
import { axios } from "@/lib/axios";
import { redirect } from "next/navigation";

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
        <p>لا يوجد كتب حاليا</p>
      )}
    </main>
  );
}
