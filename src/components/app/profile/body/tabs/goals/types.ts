export type GoalProps = {
  id: number;
  title: string | null;
  description: string | null;
  numberOfBooksToRead: number;
  startDate: string;
  endDate: string;
  durationInDays: number;
  userId: string;
};

export type GoalDialogProps =
  | {
      type: "add";
      goal?: never;
    }
  | {
      type: "edit";
      goal: GoalProps;
    };
