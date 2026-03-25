import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Rate from "./Rate";

import { useUserStore } from "@/providers/user-store-provider";
import { ReviewProps } from "./types";
import ReviewDialog from "./ReviewDialog";
import DeleteReview from "./DeleteReview";

export default function Review({ review }: { review: ReviewProps }) {
  const { user: theCurrentUser } = useUserStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{review.title}</CardTitle>
        <h2 className="flex items-center gap-2">
          <span className="font-yoc text-lg font-medium text-gray-300">
            {review.book.title}
          </span>{" "}
          <Rate rate={review.rate} />
        </h2>
        {theCurrentUser?.id === review.userId && (
          <CardAction className="border-light-gray flex gap-1 rounded-md border">
            <ReviewDialog type="edit" reviewId={review.id} />
            <DeleteReview reviewId={review.id} />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {review.content.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </CardContent>
    </Card>
  );
}
