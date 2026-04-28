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
import { DeletePostProps } from "./types";

export default function DeletePost({
  postId,
  queryKey,
  title,
}: DeletePostProps) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/community/`, {
        params: {
          postId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
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
          <DialogTitle>
            {title ?? "هل أنت متأكد أنك تريد حذف هذا المنشور؟"}
          </DialogTitle>
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
