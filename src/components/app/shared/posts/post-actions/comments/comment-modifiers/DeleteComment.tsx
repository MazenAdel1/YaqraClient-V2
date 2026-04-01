import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { CommentProps } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";

export default function DeleteComment({ comment }: { comment: CommentProps }) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/community/comment?commentId=${comment.id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["comments", comment.postId] });
    },
  });

  const deleteComment = async () => {
    await mutateAsync();
  };
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant={"outline"}>
            <Trash className="size-4" />
          </Button>
        }
      />

      <DialogContent>
        <DialogTitle>حذف التعليق</DialogTitle>
        <Button
          variant={"destructive"}
          onClick={deleteComment}
          disabled={isPending}
        >
          تأكيد الحذف {isPending && <Loader2 className="size-4 animate-spin" />}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
