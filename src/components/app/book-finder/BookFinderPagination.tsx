import { InfiniteQueryResponse } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BookProps } from "../shared";

export default function BookFinderPagination({
  page,
  data,
  query,
}: {
  page?: string;
  data: InfiniteQueryResponse<BookProps>;
  query: string;
}) {
  const hasNextPage = data.pageNumber < data.totalPages;

  return (
    <div className="flex items-center gap-2">
      {data.pageNumber > 1 && (
        <Button
          size={"icon"}
          variant={"outline"}
          nativeButton={false}
          render={
            <Link href={`/book-finder?${query}&page=${data.pageNumber - 1}`}>
              <ArrowRight className="size-3.5" />
            </Link>
          }
        />
      )}
      {
        <Button
          variant={"outline"}
          size={"icon"}
          className={"pointer-events-none"}
        >
          {page || 1}
        </Button>
      }
      {hasNextPage && (
        <Button
          size={"icon"}
          variant="outline"
          nativeButton={false}
          render={
            <Link href={`/book-finder?${query}&page=${data.pageNumber + 1}`}>
              <ArrowLeft className="size-3.5" />
            </Link>
          }
        />
      )}
    </div>
  );
}
