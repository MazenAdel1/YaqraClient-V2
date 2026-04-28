"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessagesSquare } from "lucide-react";
import { CommentProps, CommentsDialogProps } from "./types";
import { Activity, createContext, useState } from "react";
import Comments from "./Comments";
import AddCommentForm from "./AddCommentForm";

export const SelectedCommentContext = createContext({
  selectedComment: null as CommentProps | null,
  setSelectedComment: (comment: CommentProps | null) => {},
});

export default function CommentsDialog({
  children,
  postId,
}: CommentsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentProps | null>(
    null,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={"outline"}>
            <MessagesSquare className="size-4" />
          </Button>
        }
      />
      <DialogContent
        render={
          <Card className="flex flex-col gap-2 md:min-w-xl">
            <Card>{children}</Card>
            <Card>
              <SelectedCommentContext.Provider
                value={{ selectedComment, setSelectedComment }}
              >
                <CardContent>
                  <Activity mode={open ? "visible" : "hidden"}>
                    <Comments postId={postId} />
                  </Activity>
                </CardContent>
                <CardFooter>
                  <AddCommentForm postId={postId} />
                </CardFooter>
              </SelectedCommentContext.Provider>
            </Card>
          </Card>
        }
      />
    </Dialog>
  );
}
