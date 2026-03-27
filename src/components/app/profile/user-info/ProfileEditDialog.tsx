"use client";

import { Form } from "@/components/shared/form";
import { FormProps } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPen } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { PROFILE_EDIT_INPUTS, PROFILE_EDIT_SCHEMA } from "./consts";

export default function ProfileEditDialog({
  defaultValues,
}: {
  defaultValues: FormProps<typeof PROFILE_EDIT_SCHEMA>["defaultValues"];
}) {
  const FormRef = useRef<HTMLFormElement>(null);
  const DialogCloseRef = useRef<HTMLButtonElement>(null);

  const INPUTS_DEFAULT_VALUES: FormProps<
    typeof PROFILE_EDIT_SCHEMA
  >["defaultValues"] = {
    ...defaultValues,
  };

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      if (!FormRef.current) return;

      const formData = new FormData(FormRef.current);
      await axios.put("/user/all", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      DialogCloseRef.current?.click();
      toast.success("تم تحديث البيانات الشخصية بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });

  const onSubmit = async () => {
    await mutateAsync();
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className={"flex items-center justify-center"}>
            تعديل البيانات الشخصية <UserPen />
          </Button>
        }
      />
      <DialogContent>
        <DialogClose className={"hidden"} ref={DialogCloseRef} />
        <DialogHeader>
          <DialogTitle>تعديل البيانات الشخصية</DialogTitle>
        </DialogHeader>
        <Form
          ref={FormRef}
          schema={PROFILE_EDIT_SCHEMA}
          inputs={PROFILE_EDIT_INPUTS}
          defaultValues={INPUTS_DEFAULT_VALUES}
          onSubmit={onSubmit}
          submitLabel="تحديث البيانات الشخصية"
        />
      </DialogContent>
    </Dialog>
  );
}
