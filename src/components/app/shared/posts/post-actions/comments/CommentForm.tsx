"use client";

import { Form } from "@/components/shared/form";
import { axios } from "@/lib/axios";
import { useUserStore } from "@/providers/user-store-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useRef } from "react";
import { z } from "zod";
import { SelectedCommentContext } from "./CommentsDialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const commentSchema = z.object({
  content: z.string("لا يمكن ترك التعليق فارغًا"),
});

type CommentFormProps = {
  postId: number;
};

export default function CommentForm({ postId }: CommentFormProps) {
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const { selectedComment, setSelectedComment } = useContext(
    SelectedCommentContext,
  );

  const { mutateAsync } = useMutation({
    mutationFn: async (content: string) => {
      await axios.post("/community/comment", {
        PostId: postId,
        Content: content,
        UserId: user?.id,
        ParentCommentId: selectedComment?.id || null,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      formRef.current?.reset();
    },
  });

  const truncatedContent =
    (selectedComment?.content.length as number) > 20
      ? selectedComment?.content.slice(0, 20) + "..."
      : selectedComment?.content;

  return (
    <div className="flex h-18 w-full flex-col gap-1">
      {selectedComment && (
        <div className="flex justify-between rounded-md bg-stone-800 p-1">
          <p className="text-gray-300">
            رد على: <span className="font-bold">{truncatedContent}</span>
          </p>
          <Button
            variant={"ghost"}
            size={"xs"}
            onClick={() => setSelectedComment(null)}
          >
            {" "}
            <X />
          </Button>
        </div>
      )}
      <Form
        schema={commentSchema}
        inputs={[
          {
            name: "content",
            label: "تعليق",
            placeholder: "اكتب تعليقك...",
            autoFocus: true,
            type: "textarea",
          },
        ]}
        onSubmit={async (data) => {
          await mutateAsync(data.content);
        }}
        submitLabel="ارسال"
        inline
        hideLabels
        ref={formRef}
        className="mt-auto w-full"
      />
    </div>
  );
}
