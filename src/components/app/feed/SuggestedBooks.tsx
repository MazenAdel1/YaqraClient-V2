import { Book } from "lucide-react";
import Image from "next/image";
import Rate from "../shared/posts/review/Rate";
import { BookProps } from "../shared";

export default function SuggestedBooks({ books }: { books: BookProps[] }) {
  return (
    <div className="flex w-full gap-3 overflow-y-auto pb-2">
      {books.map((book) => (
        <div key={book.id} className="flex w-48 shrink-0 flex-col gap-1">
          <div className="border-light-gray flex size-full items-center justify-center rounded-lg border">
            {book.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}${book.image}`}
                alt={book.title}
                className="h-auto w-full rounded"
                width={200}
                height={300}
              />
            ) : (
              <Book className="size-7" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-yoc">{book.title}</h3>
            {book.rate && <Rate rate={book.rate} />}
          </div>
        </div>
      ))}
    </div>
  );
}
