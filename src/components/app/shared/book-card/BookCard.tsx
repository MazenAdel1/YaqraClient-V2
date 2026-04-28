import { ApiBookProps } from "@/components/app/shared/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Rate } from "../posts/review";

export default function BookCard({
  id,
  numberOfPages,
  rate,
  image,
  title,
  authorsDto,
  genresDto,
}: ApiBookProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <Link
          href={`/book/${id}`}
          className="border-light-gray relative aspect-square overflow-hidden rounded-lg border"
        >
          {image ? (
            <>
              <Image
                src={`${process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL}${image}`}
                width={100}
                height={400}
                alt={title}
                className="h-full w-full blur-xl"
              />
              <Image
                src={`${process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL}${image}`}
                width={100}
                height={400}
                alt={title}
                className="absolute top-1/2 left-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md transition duration-300 ease-out hover:scale-110"
              />
            </>
          ) : (
            <div className="flex size-full items-center justify-center">
              <Book className="size-7" />
            </div>
          )}
        </Link>
        <div className="flex flex-col gap-5">
          <div className="flex w-full flex-col justify-center gap-1">
            <CardTitle className="flex items-center gap-1">
              <h3 className="font-yoc text-lg font-bold">
                <Link href={`/book/${id}`}>{title}</Link>
              </h3>{" "}
              <Badge variant={"secondary"}>{numberOfPages} ص</Badge>
              {rate !== null && <Rate rate={Number(rate)} />}
            </CardTitle>
            {authorsDto.map((author) => (
              <Link
                key={author.id}
                href={`/author/${author.id}`}
                className="text-muted-foreground text-sm font-medium transition hover:text-white"
              >
                {author.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {genresDto?.map((g) => (
              <Badge key={g.genreId} variant={"outline"}>
                {g.genreName}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
