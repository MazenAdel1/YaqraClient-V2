import { FormProps } from "@/components/shared/form";
import z from "zod";

export const REGISTER_FORM_SCHEMA = z
  .object({
    username: z.string("اسم المستخدم مطلوب"),
    email: z.email("البريد الإلكتروني غير صالح"),
    password: z.string("كلمة المرور مطلوبة"),
    confirmpassword: z.string("تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmpassword"],
  });

export const REGISTER_FORM_INPUTS: FormProps<
  typeof REGISTER_FORM_SCHEMA
>["inputs"] = [
  {
    label: "اسم المستخدم",
    name: "username",
    type: "text",
    placeholder: "أدخل اسم المستخدم",
    autoFocus: true,
  },
  {
    label: "البريد الإلكتروني",
    name: "email",
    type: "email",
    placeholder: "أدخل البريد الإلكتروني",
  },
  {
    label: "كلمة المرور",
    name: "password",
    type: "password",
    placeholder: "أدخل كلمة المرور",
  },
  {
    label: "تأكيد كلمة المرور",
    name: "confirmpassword",
    type: "password",
    placeholder: "أدخل كلمة المرور مرة أخرى",
  },
];
