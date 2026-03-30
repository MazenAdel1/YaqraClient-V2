import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2, PlusCircle } from "lucide-react";
import { Form, FormProps } from "@/components/shared/form";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { useRef } from "react";
import { useUserStore } from "@/providers/user-store-provider";
import { DiscussionDialogProps } from "./types";
import { TAGS } from "./consts";

export default function DiscussionDialog({
  type,
  discussion,
}: DiscussionDialogProps) {
  const { user } = useUserStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  const SCHEMA = z.object({
    ...(type === "edit" ? { Id: z.number().default(discussion.id) } : {}),
    UserId: z.string().default(user?.id as string),
    Title: z.string(),
    Content: z.string().optional(),
    tag: z.number().default(0),
    BooksIds: z.array(z.coerce.number()),
  });

  const INPUTS: FormProps<typeof SCHEMA>["inputs"] = [
    {
      label: "العنوان",
      name: "Title",
      type: "text",
      placeholder: "أدخل عنوان النقاش",
    },
    {
      label: "المحتوى",
      name: "Content",
      type: "textarea",
      placeholder: "أدخل محتوى النقاش",
    },
    {
      label: "الكتب",
      name: "BooksIds",
      type: "search-select",
      placeholder: "ابحث باسم الكتاب",
      search: {
        endpoint: "/book/title",
        queryParam: "bookTitle",
        optionValueKey: "id",
        optionLabelKey: "title",
        defaultOptions:
          type === "edit" && discussion?.books
            ? discussion.books.map((book: { id: number; title: string }) => ({
                value: book.id,
                label: book.title,
              }))
            : undefined,
        minQueryLength: 2,
        noResultsText: "لا توجد كتب مطابقة",
        multiple: true,
      },
    },
    {
      label: "التصنيف",
      name: "tag",
      type: "select",
      placeholder: "اختر تصنيف النقاش",
      options: [
        { value: 0, label: "نقاش" },
        { value: 1, label: "مقال" },
        { value: 2, label: "أخبار" },
      ],
    },
  ];

  const defaultValues: FormProps<typeof SCHEMA>["defaultValues"] =
    type === "edit"
      ? {
          Title: discussion?.title,
          Content: discussion?.content,
          BooksIds: discussion?.books?.map((book: { id: number }) => book.id),
          tag: TAGS[discussion?.tag as keyof typeof TAGS]?.value,
        }
      : undefined;

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (data: z.input<typeof SCHEMA>) => {
      if (type === "add") {
        const formData = new FormData();
        formData.append("Title", data.Title);
        formData.append("Content", data.Content || "");
        formData.append("UserId", data.UserId as string);
        formData.append("tag", String(data.tag));
        data.BooksIds.forEach((id) => formData.append("BooksIds", String(id)));

        await axios.post("/community/discussion", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.put("/community/discussion", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile-discussions"],
      });

      closeRef.current?.click();
    },
  });

  const onSubmit: FormProps<typeof SCHEMA>["onSubmit"] = async (formData) => {
    await mutateAsync(formData);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          type === "edit" ? (
            <Button variant="ghost" size="icon">
              <Edit2 className="size-4" />
            </Button>
          ) : (
            <Button className="w-fit">
              إضافة نقاش
              <PlusCircle className="size-3.5" />
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogClose className="hidden" ref={closeRef} />
        <Form
          key={type === "edit" ? JSON.stringify(discussion) : "new"}
          schema={SCHEMA}
          inputs={INPUTS}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          submitLabel={type === "edit" ? "تعديل النقاش" : "إضافة نقاش"}
        />
      </DialogContent>
    </Dialog>
  );
}
