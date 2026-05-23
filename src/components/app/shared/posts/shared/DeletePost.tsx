"use client";

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

import { useState } from "react";

export default function DeletePost({
  postId,
  queryKey,
  title,
  open,
  onOpenChange,
}: DeletePostProps & {
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
      await axios.delete(`/community/`, {
        params: {
          postId,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setIsOpen(false);
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger
          render={
            <Button variant="destructive" size="icon">
              <Trash className="size-4" />
            </Button>
          }
        />
      )}
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
