import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CommentProps } from "../types";
import DeleteComment from "./DeleteComment";
import EditComment from "./EditComment";
import { Button } from "@/components/ui/button";
import { Edit, Trash, EllipsisIcon } from "lucide-react";

export default function CommentModifiers({
  comment,
}: {
  comment: CommentProps;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={
            <Button variant={"outline"}>
              <EllipsisIcon />
            </Button>
          }
        />
        <DropdownMenuContent className="flex flex-col gap-1 *:w-full">
          <DropdownMenuItem
            nativeButton={true}
            render={
              <Button variant={"ghost"} size={"icon"}>
                <Edit className="size-4" />
              </Button>
            }
            onClick={() => setIsEditDialogOpen(true)}
          />
          <MenuPrimitive.Item
            nativeButton={true}
            render={
              <Button variant={"destructive"} size={"icon"}>
                <Trash className="size-4" />
              </Button>
            }
            onClick={() => setIsDeleteDialogOpen(true)}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <EditComment
        comment={comment}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <DeleteComment
        comment={comment}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
