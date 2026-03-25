import { FormInput } from "@/components/shared/form";
import z from "zod";

export const PROFILE_EDIT_SCHEMA = z.object({
  pic: z.union([z.file(), z.string().min(1)]).optional(),
  userName: z.string().optional(),
  userBio: z.string().optional(),
});

export const PROFILE_EDIT_INPUTS: FormInput<typeof PROFILE_EDIT_SCHEMA>[] = [
  {
    name: "pic",
    label: "صورة الملف الشخصي",
    type: "file",
    accept: "image/*",
  },
  {
    name: "userName",
    label: "اسم المستخدم",
    type: "text",
    placeholder: "أدخل اسم المستخدم الجديد",
  },
  {
    name: "userBio",
    label: "نبذة عنك",
    type: "textarea",
    placeholder: "أدخل نبذة عنك",
  },
];

export const PASSWORD_EDIT_SCHEMA = z
  .object({
    currentpassword: z.string().min(6, "كلمة المرور الحالية مطلوبة"),
    newpassword: z
      .string()
      .min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"),
    confirmnewpassword: z
      .string()
      .min(6, "تأكيد كلمة المرور الجديدة يجب أن يكون 6 أحرف على الأقل"),
  })
  .refine((data) => data.newpassword === data.confirmnewpassword, {
    message: "كلمتا المرور الجديدتان غير متطابقتين",
  });

export const PASSWORD_EDIT_INPUTS: FormInput<typeof PASSWORD_EDIT_SCHEMA>[] = [
  {
    name: "currentpassword",
    label: "كلمة المرور الحالية",
    type: "password",
    placeholder: "أدخل كلمة المرور الحالية",
  },
  {
    name: "newpassword",
    label: "كلمة المرور الجديدة",
    type: "password",
    placeholder: "أدخل كلمة المرور الجديدة",
  },
  {
    name: "confirmnewpassword",
    label: "تأكيد كلمة المرور الجديدة",
    type: "password",
    placeholder: "أدخل تأكيد كلمة المرور الجديدة",
  },
];
