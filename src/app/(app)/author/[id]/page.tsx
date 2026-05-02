import { AuthorBooks } from "@/components/app/author";
import { Rate } from "@/components/app/shared/posts/review";
import { axios } from "@/lib/axios";
import { User } from "lucide-react";
import Image from "next/image";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { result: author } = (
    await axios.get(`/author/id`, {
      params: {
        authorId: id,
      },
    })
  ).data;

  const { data: initialBooks } = (
    await axios.get("/author/books", {
      params: {
        page: 1,
        authorId: author.id,
      },
    })
  ).data.result;

  return (
    <section className="container flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <div className="border-light-gray relative flex max-h-60 min-h-60 w-full items-center justify-center overflow-hidden rounded-lg border sm:max-h-80 md:max-h-100 lg:max-h-120 xl:max-h-140">
          {author.picture ? (
            <>
              <Image
                src={`${process.env.SERVER_URL}${author.picture}`}
                width={100}
                height={400}
                alt={author.name}
                loading="eager"
                className="size-full blur-xl"
              />
              <Image
                src={`${process.env.SERVER_URL}${author.picture}`}
                width={100}
                height={400}
                alt={author.name}
                loading="eager"
                className="absolute top-1/2 left-1/2 h-[60%] w-fit -translate-x-1/2 -translate-y-1/2 rounded-md object-cover transition duration-300 ease-out hover:scale-110"
              />
            </>
          ) : (
            <div className="flex size-full items-center justify-center">
              <User className="size-8" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <h1 className="font-yoc text-xl font-semibold md:text-2xl lg:text-3xl xl:text-4xl">
                {author.name}
              </h1>
              {author.rate !== null && <Rate rate={Number(author.rate)} />}
            </div>
          </div>

          {author.bio && <p className="mt-3">{author.bio}</p>}
        </div>
      </section>
      <AuthorBooks author={author} initialBooks={initialBooks} />
    </section>
  );
}
