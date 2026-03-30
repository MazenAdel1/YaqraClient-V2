import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessagesSquare } from "lucide-react";
import { CommentsProps } from "./types";

export default function Comments({ children }: CommentsProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant={"outline"}>
            <MessagesSquare className="size-4" />
          </Button>
        }
      />
      <DialogContent
        render={
          <Card className="flex flex-col gap-2">
            <Card>{children}</Card>
            <Card>
              <CardContent>comment</CardContent>
            </Card>
          </Card>
        }
      />
    </Dialog>
  );
}
