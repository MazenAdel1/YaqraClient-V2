import Rate from "./Rate";
import { ReviewProps } from "./types";
import ReviewDialog from "./ReviewDialog";
import Image from "next/image";
import { Book } from "lucide-react";
import FormattedText from "../../FormattedText";
import PostWrapper from "../shared/PostWrapper";

export default function Review({ review }: { review: ReviewProps }) {
  return (
    <PostWrapper
      editDialog={<ReviewDialog type="edit" review={review} />}
      post={review}
      queryKey="profile-reviews"
    >
      <div className="flex items-center gap-2">
        <div className="bg-dark-gray flex h-20 w-15 items-center justify-center overflow-hidden rounded-sm">
          {review.book.image ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}${review.book.image}`}
              alt={review.book.title}
              width={50}
              height={74}
              className="size-full"
            />
          ) : (
            <Book className="size-6" />
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg">{review.title}</h1>
          <h2 className="flex items-center gap-2">
            <span className="font-yoc text-lg font-medium text-gray-300">
              {review.book.title}
            </span>{" "}
            <Rate rate={review.rate} />
          </h2>
        </div>
      </div>
      <FormattedText text={review.content} />
    </PostWrapper>
  );
}
