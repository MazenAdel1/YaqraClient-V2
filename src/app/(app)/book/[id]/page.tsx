import { ApiBookProps } from "@/components/app/shared";
import { Rate, ReviewProps } from "@/components/app/shared/posts/review";
import { Badge } from "@/components/ui/badge";
import { axios } from "@/lib/axios";
import { Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BookReviews } from "@/components/app/book";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { result: book }: { result: ApiBookProps } = (
    await axios.get("/book/id", {
      params: {
        bookId: id,
      },
    })
  ).data;

  const { data: initialReviews }: { data: ReviewProps[] } = (
    await axios.get("/book/reviews", {
      params: {
        bookId: id,
        page: 1,
      },
    })
  ).data.result;

  return (
    <section className="container flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <div className="border-light-gray relative flex max-h-60 min-h-60 w-full items-center justify-center overflow-hidden rounded-lg border sm:max-h-80 md:max-h-100 lg:max-h-120 xl:max-h-140">
          {book.image ? (
            <>
              <Image
                src={`${process.env.SERVER_URL}${book.image}`}
                width={100}
                height={400}
                alt={book.title}
                loading="eager"
                className="size-full blur-xl"
              />
              <Image
                src={`${process.env.SERVER_URL}${book.image}`}
                width={100}
                height={400}
                alt={book.title}
                loading="eager"
                className="absolute top-1/2 left-1/2 h-[60%] w-fit -translate-x-1/2 -translate-y-1/2 rounded-md object-cover transition duration-300 ease-out hover:scale-110"
              />
            </>
          ) : (
            <div className="flex size-full items-center justify-center">
              <Book className="size-8" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <h1 className="font-yoc text-xl font-semibold md:text-2xl lg:text-3xl xl:text-4xl">
                {book.title}
              </h1>
              <Badge variant={"secondary"}>{book.numberOfPages} ص</Badge>
              {book.rate !== null && <Rate rate={Number(book.rate)} />}
            </div>
            <div className="flex items-center gap-1">
              {book.genresDto.map((genre) => (
                <Badge variant={"outline"} key={genre.genreId}>
                  {genre.genreName}
                </Badge>
              ))}
            </div>
          </div>
          <Link
            href={`/author/${book.authorsDto[0].id}`}
            className="text-muted-foreground w-fit text-sm font-medium transition hover:text-white md:text-base"
          >
            {book.authorsDto[0].name}
          </Link>
          {book.description && <p className="mt-3">{book.description}</p>}
        </div>
      </section>
      <BookReviews book={book} initialReviews={initialReviews} />
    </section>
  );
}
