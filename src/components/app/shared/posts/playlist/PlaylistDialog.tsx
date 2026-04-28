"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle } from "lucide-react";
import { Form, FormProps } from "@/components/shared/form";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { useRef } from "react";
import { useUserStore } from "@/providers/user-store-provider";
import { PlaylistDialogProps } from "./types";

export default function PlaylistDialog({
  type,
  data: playlist,
}: PlaylistDialogProps) {
  const { user } = useUserStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  const SCHEMA = z.object({
    ...(type === "edit" ? { Id: z.number().default(playlist.id) } : {}),
    UserId: z.string().default(user?.id as string),
    Title: z.string(),
    Content: z.string(),
    BooksIds: z.array(z.coerce.number()),
  });

  const INPUTS: FormProps<typeof SCHEMA>["inputs"] = [
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
          type === "edit" && playlist?.books
            ? playlist.books.map((book: { id: number; title: string }) => ({
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
      label: "عنوان القائمة",
      name: "Title",
      type: "text",
      placeholder: "أدخل عنوان المراجعة",
    },
    {
      label: "محتوى القائمة",
      name: "Content",
      type: "textarea",
      placeholder: "أدخل محتوى المراجعة",
    },
  ];

  const defaultValues: FormProps<typeof SCHEMA>["defaultValues"] =
    type === "edit"
      ? {
          Content: playlist?.content,
          Title: playlist?.title,
          BooksIds: playlist?.books?.map((book: { id: number }) => book.id),
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
        data.BooksIds.forEach((id) => formData.append("BooksIds", String(id)));

        await axios.post("/community/playlist", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.put("/community/playlist", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile-playlists"],
      });

      closeRef.current?.click();
    },
  });

  const onSubmit: FormProps<typeof SCHEMA>["onSubmit"] = async (data) => {
    await mutateAsync(data);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          type === "edit" ? (
            <Button variant="ghost" size="icon">
              <Edit className="size-4" />
            </Button>
          ) : (
            <Button className="w-fit">
              إضافة مراجعة
              <PlusCircle className="size-3.5" />
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogClose className={"hidden"} ref={closeRef} />
        <Form
          key={type === "edit" ? JSON.stringify(playlist) : "new"}
          schema={SCHEMA}
          inputs={INPUTS}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          submitLabel={type === "edit" ? "تعديل المراجعة" : "إضافة مراجعة"}
        />
      </DialogContent>
    </Dialog>
  );
}
