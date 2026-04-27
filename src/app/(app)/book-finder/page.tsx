import { BookFinderSearch } from "@/components/app/book-finder";
import BookCard from "@/components/app/book-finder/book-card/BookCard";
import { ApiBookProps } from "@/components/app/shared";
import { axios } from "@/lib/axios";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{
    AuthorIds?: string | string[];
    GenreIds?: string | string[];
    MinimumRate?: string;
  }>;
}) {
  const { AuthorIds, GenreIds, MinimumRate } = await searchParams;

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

  const { data } = await axios.get(`/book/find?${query}`);

  return (
    <>
      <BookFinderSearch />
      <section className="container grid grid-cols-1 gap-3 px-2 md:grid-cols-2 md:gap-4 md:px-0 lg:w-[55%] lg:gap-5 xl:w-[65%] xl:grid-cols-3">
        {data.result.data?.map((book: ApiBookProps) => (
          <BookCard
            {...book}
            author={book.authorsDto[0]}
            genres={book.genresDto}
            key={book.id}
          />
        ))}
      </section>
    </>
  );
}
