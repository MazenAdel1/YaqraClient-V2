import { Form, FormProps } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import z from "zod";
import { CommentProps } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { useState } from "react";

export default function EditComment({ comment }: { comment: CommentProps }) {
  const [open, setOpen] = useState(false);

  const SCHEMA = z.object({
    commentId: z.number().min(1).default(comment.id),
    content: z
      .string()
      .min(1, "التعليق لا يمكن أن يكون فارغ")
      .default(comment.content),
  });

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async (data: z.infer<typeof SCHEMA>) => {
      const formData = new FormData();
      formData.append("commentId", data.commentId.toString());
      formData.append("content", data.content);

      await axios.put("/community/comment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["comments", comment.postId],
      });
      setOpen(false);
    },
  });

  const onSubmit: FormProps<typeof SCHEMA>["onSubmit"] = async (data) => {
    await mutateAsync(data);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={"ghost"} size={"icon"}>
            <Edit className="size-4" />
          </Button>
        }
      />
      <DialogContent>
        <Form
          inputs={[
            {
              label: "التعليق",
              name: "content",
              type: "text",
            },
          ]}
          defaultValues={{
            content: comment.content,
          }}
          schema={SCHEMA}
          onSubmit={onSubmit}
          submitLabel="تحديث التعليق"
        />
      </DialogContent>
    </Dialog>
  );
}
