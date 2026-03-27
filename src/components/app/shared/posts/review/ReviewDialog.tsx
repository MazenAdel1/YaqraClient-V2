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
import { ReviewDialogProps } from "./types";

export default function ReviewDialog({ type, review }: ReviewDialogProps) {
  const { user } = useUserStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  const SCHEMA = z.object({
    ...(type === "edit" ? { Id: z.number().default(review.id) } : {}),
    UserId: z.string().default(user?.id as string),
    Title: z.string().optional(),
    Content: z.string(),
    Rate: z.number().min(0).max(10),
    BookId: z.coerce.number(),
  });

  const INPUTS: FormProps<typeof SCHEMA>["inputs"] = [
    {
      label: "الكتاب",
      name: "BookId",
      type: "search-select",
      placeholder: "ابحث باسم الكتاب",
      search: {
        endpoint: "/book/title",
        queryParam: "bookTitle",
        optionValueKey: "id",
        optionLabelKey: "title",
        defaultOption:
          type === "edit" && review?.book
            ? {
                value: review.book.id,
                label: review.book.title,
              }
            : undefined,
        minQueryLength: 2,
        noResultsText: "لا توجد كتب مطابقة",
      },
    },
    {
      label: "عنوان المراجعة",
      name: "Title",
      type: "text",
      placeholder: "أدخل عنوان المراجعة",
    },
    {
      label: "محتوى المراجعة",
      name: "Content",
      type: "textarea",
      placeholder: "أدخل محتوى المراجعة",
    },
    {
      label: "التقييم (0-10)",
      name: "Rate",
      type: "number",
      placeholder: "أدخل تقييمك من 0 إلى 10",
    },
  ];

  const defaultValues: FormProps<typeof SCHEMA>["defaultValues"] =
    type === "edit"
      ? {
          Content: review?.content,
          Title: review?.title,
          Rate: review?.rate,
          BookId: review?.book.id,
        }
      : undefined;

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (data: z.input<typeof SCHEMA>) => {
      await axios[type === "edit" ? "put" : "post"]("/community/review", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile-reviews"],
      });
      if (type === "edit" && review?.id) {
        queryClient.invalidateQueries({
          queryKey: ["review", review.id],
        });
      }
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
              <Edit2 className="size-4" />
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
          key={type === "edit" ? JSON.stringify(review) : "new"}
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
