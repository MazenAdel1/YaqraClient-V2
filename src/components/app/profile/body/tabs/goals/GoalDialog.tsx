"use client";

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
import { GoalDialogProps } from "./types";

export default function GoalDialog({ type, goal }: GoalDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const SCHEMA = z.object({
    ...(type === "edit" ? { Id: z.number().default(goal.id) } : {}),
    Title: z.string().optional(),
    Description: z.string().optional(),
    NumberOfBooksToRead: z.coerce.number().min(1),
    StartDate: z.string(),
    DurationInDays: z.coerce.number().min(1),
  });

  const INPUTS: FormProps<typeof SCHEMA>["inputs"] = [
    {
      label: "عنوان الهدف",
      name: "Title",
      type: "text",
      placeholder: "أدخل عنوان الهدف (اختياري)",
    },
    {
      label: "الوصف",
      name: "Description",
      type: "textarea",
      placeholder: "أدخل وصف الهدف (اختياري)",
    },
    {
      label: "عدد الكتب المراد قراءتها",
      name: "NumberOfBooksToRead",
      type: "number",
      placeholder: "أدخل عدد الكتب",
    },
    {
      label: "تاريخ البداية",
      name: "StartDate",
      type: "date",
      placeholder: "اختر تاريخ البداية",
    },
    {
      label: "المدة (بالأيام)",
      name: "DurationInDays",
      type: "number",
      placeholder: "أدخل المدة بالأيام",
    },
  ];

  const formatDateForInput = (dateString: string) => {
    return dateString.split("T")[0];
  };

  const defaultValues: FormProps<typeof SCHEMA>["defaultValues"] =
    type === "edit"
      ? {
          Title: goal?.title ?? undefined,
          Description: goal?.description ?? undefined,
          NumberOfBooksToRead: goal?.numberOfBooksToRead,
          StartDate: formatDateForInput(goal?.startDate),
          DurationInDays: goal?.durationInDays,
        }
      : undefined;

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (data: z.input<typeof SCHEMA>) => {
      await axios[type === "edit" ? "put" : "post"]("/user/goal", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile-goals"],
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
              <Edit2 className="size-4" />
            </Button>
          ) : (
            <Button className="w-fit">
              إضافة هدف
              <PlusCircle className="size-3.5" />
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogClose className="hidden" ref={closeRef} />
        <Form
          key={type === "edit" ? JSON.stringify(goal) : "new"}
          schema={SCHEMA}
          inputs={INPUTS}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          submitLabel={type === "edit" ? "تعديل الهدف" : "إضافة هدف"}
        />
      </DialogContent>
    </Dialog>
  );
}
