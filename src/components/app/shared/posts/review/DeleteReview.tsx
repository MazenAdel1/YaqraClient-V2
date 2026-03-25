import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash } from "lucide-react";

export default function DeleteReview({ reviewId }: { reviewId: number }) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      await axios.delete("/community/", {
        params: {
          postId: reviewId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-reviews"] });
    },
  });
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon">
            <Trash className="size-4" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>هل أنت متأكد أنك تريد حذف هذه المراجعة؟</DialogTitle>
        </DialogHeader>
        <Button
          variant={"destructive"}
          className="w-full"
          onClick={async () => {
            await mutateAsync();
          }}
          disabled={isPending}
        >
          حذف{" "}
          {isPending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Trash className="size-3" />
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
