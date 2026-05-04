import {
  BookFinderFilter,
  BookFinderPagination,
  BookFinderSearch,
} from "@/components/app/book-finder";
import BookCard from "@/components/app/shared/book-card/BookCard";
import { ApiBookProps } from "@/components/app/shared";
import { axios } from "@/lib/axios";
import { redirect } from "next/navigation";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{
    AuthorIds?: string | string[];
    GenreIds?: string | string[];
    MinimumRate?: string;
    page?: string;
  }>;
}) {
  const { AuthorIds, GenreIds, MinimumRate, page } = await searchParams;

  if (page && (Number(page) < 1 || !Number.isInteger(Number(page))))
    return redirect("/book-finder");

  let query = "";

  if (AuthorIds) {
    if (Array.isArray(AuthorIds)) {
      AuthorIds.forEach((id, index) => {
        query += `AuthorIds=${id}${index < AuthorIds.length - 1 ? "&" : ""}`;
      });
    } else {
      query += `AuthorIds=${AuthorIds}`;
    }
  }

  if (GenreIds) {
    if (Array.isArray(GenreIds)) {
      GenreIds.forEach((id, index) => {
        query += `&GenreIds=${id}${index < GenreIds.length - 1 ? "&" : ""}`;
      });
    } else {
      query += `&GenreIds=${GenreIds}`;
    }
  }

  if (MinimumRate) {
    query += `&MinimumRate=${MinimumRate}`;
  }

  const { data } = await axios.get(`/book/find?${query}&page=${page || 1}`);

  return (
    <>
      <BookFinderFilter />
      <div className="container flex flex-col gap-5 px-2 lg:w-[55%] xl:w-[65%]">
        <div className="flex items-center gap-3 lg:gap-5">
          <BookFinderSearch />
          <BookFinderPagination
            data={data.result}
            page={page}
            query={query}
            basePath="/book-finder"
          />
        </div>
        <section className="grid-layout-3">
          {data.result.data?.map((book: ApiBookProps) => (
            <BookCard key={book.id} {...book} />
          ))}
        </section>
      </div>
    </>
  );
}
