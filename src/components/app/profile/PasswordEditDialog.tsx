import { Form, FormProps } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PenLine } from "lucide-react";
import { PASSWORD_EDIT_INPUTS, PASSWORD_EDIT_SCHEMA } from "./consts";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { axios } from "@/lib/axios";
import { useRef } from "react";
import { toast } from "sonner";

export default function PasswordEditDialog() {
  const FormRef = useRef<HTMLFormElement>(null);
  const DialogCloseRef = useRef<HTMLButtonElement>(null);

  const { mutateAsync } = useMutation({
    mutationFn: async (data: z.input<typeof PASSWORD_EDIT_SCHEMA>) => {
      await axios.put("/user/pass", data);
    },
    onSuccess: () => {
      DialogCloseRef.current?.click();
      toast.success("تم تحديث كلمة المرور بنجاح");
    },
  });

  const onSubmit: FormProps<typeof PASSWORD_EDIT_SCHEMA>["onSubmit"] = async (
    data,
  ) => {
    await mutateAsync(data);
  };
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className={"flex items-center justify-between"}
          >
            تعديل كلمة المرور <PenLine />
          </Button>
        }
      />
      <DialogContent>
        <DialogClose ref={DialogCloseRef} className={"hidden"} />
        <DialogHeader>
          <DialogTitle>تعديل كلمة المرور</DialogTitle>
        </DialogHeader>
        <Form
          ref={FormRef}
          schema={PASSWORD_EDIT_SCHEMA}
          inputs={PASSWORD_EDIT_INPUTS}
          onSubmit={onSubmit}
          submitLabel="تحديث كلمة المرور"
        />
      </DialogContent>
    </Dialog>
  );
}
