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
import { UserImage } from "../../user";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import { Book } from "lucide-react";
import DeletePost from "../shared/DeletePost";
import FormattedText from "../../FormattedText";

export default function Review({ review }: { review: ReviewProps }) {
  const { user: theCurrentUser } = useUserStore();

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-center gap-2">
          <UserImage id={review.userId} />
          <div className="flex flex-col gap-0.5">
            <Link href={`/profile/${review.userId}`}>{review.username}</Link>
            <span className="text-[10px] text-gray-300">
              {timeAgo(review.createdDate)}
            </span>
          </div>
        </div>
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
            <CardTitle className="text-lg">{review.title}</CardTitle>
            <h2 className="flex items-center gap-2">
              <span className="font-yoc text-lg font-medium text-gray-300">
                {review.book.title}
              </span>{" "}
              <Rate rate={review.rate} />
            </h2>
          </div>
        </div>
        {theCurrentUser?.id === review.userId && (
          <CardAction className="border-light-gray flex gap-1 rounded-md border">
            <ReviewDialog type="edit" review={review} />
            <DeletePost
              postId={review.id}
              queryKey="profile-reviews"
              title="هل أنت متأكد من حذف هذه المراجعة؟"
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <FormattedText text={review.content} />
      </CardContent>
    </Card>
  );
}
