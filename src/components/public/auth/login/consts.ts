import { FormProps } from "@/components/shared/form";
import z from "zod";

export const LOGIN_FORM_SCHEMA = z.object({
  usernameoremail: z.string("اسم المستخدم أو البريد الإلكتروني مطلوب"),
  password: z.string("كلمة المرور مطلوبة"),
});

export const LOGIN_FORM_INPUTS: FormProps<typeof LOGIN_FORM_SCHEMA>["inputs"] =
  [
    {
      label: "اسم المستخدم أو البريد الإلكتروني",
      name: "usernameoremail",
      type: "text",
      placeholder: "أدخل اسم المستخدم أو البريد الإلكتروني",
      autoFocus: true,
    },
    {
      label: "كلمة المرور",
      name: "password",
      type: "password",
      placeholder: "أدخل كلمة المرور",
    },
  ];
