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
import { useState } from "react";

export default function DeleteComment({
  comment,
  open,
  onOpenChange,
}: {
  comment: CommentProps;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : localOpen;
  const setIsOpen = isControlled ? onOpenChange : setLocalOpen;

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/community/comment?commentId=${comment.id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["comments", comment.postId],
      });
      setIsOpen(false);
    },
  });

  const deleteComment = async () => {
    await mutateAsync();
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger
          render={
            <Button variant={"destructive"} size={"icon"}>
              <Trash className="size-4" />
            </Button>
          }
        />
      )}

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
