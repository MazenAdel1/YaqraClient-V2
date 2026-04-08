import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/providers/user-store-provider";
import { GoalProps } from "./types";
import GoalDialog from "./GoalDialog";
import DeleteGoal from "./DeleteGoal";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Target } from "lucide-react";
import { formatDate, FormattedText } from "@/components/app/shared";

export default function Goal({ goal }: { goal: GoalProps }) {
  const { user: theCurrentUser } = useUserStore();

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="text-primary size-5" />
            <CardTitle className="font-yoc text-xl">
              {goal.title ?? "هدف قراءة"}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <BookOpen className="size-3" />
            {goal.numberOfBooksToRead} كتب
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-gray-300">
          <div className="bg-dark-gray flex items-center gap-1.5 rounded-md px-2 py-1">
            <Calendar className="size-3.5" />
            <span>من {formatDate(goal.startDate)}</span>
          </div>
          <div className="bg-dark-gray flex items-center gap-1.5 rounded-md px-2 py-1">
            <Calendar className="size-3.5" />
            <span>إلى {formatDate(goal.endDate)}</span>
          </div>
          <div className="bg-dark-gray rounded-md px-2 py-1">
            {goal.durationInDays} يوم
          </div>
        </div>

        {theCurrentUser?.id === goal.userId && (
          <CardAction className="border-light-gray flex gap-1 rounded-md border">
            <GoalDialog type="edit" goal={goal} />
            <DeleteGoal goalId={goal.id} />
          </CardAction>
        )}
      </CardHeader>
      {goal.description && (
        <CardContent>
          <FormattedText text={goal.description} />
        </CardContent>
      )}
    </Card>
  );
}
