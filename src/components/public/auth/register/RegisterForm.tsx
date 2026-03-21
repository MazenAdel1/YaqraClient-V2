"use client";

import { Form, FormProps } from "@/components/shared/form";
import { axios } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { REGISTER_FORM_INPUTS, REGISTER_FORM_SCHEMA } from "./consts";

export default function LoginForm() {
  const router = useRouter();
  const onSubmit: FormProps<typeof REGISTER_FORM_SCHEMA>["onSubmit"] = async ({
    username,
    email,
    password,
    confirmpassword,
  }) => {
    await axios.post("/auth/register", {
      username,
      email,
      password,
      confirmpassword,
    });
    toast.success("تم إنشاء الحساب بنجاح، يمكنك الآن تسجيل الدخول");
    router.push("/login");
  };

  return (
    <Form
      schema={REGISTER_FORM_SCHEMA}
      inputs={REGISTER_FORM_INPUTS}
      onSubmit={onSubmit}
      submitLabel="إنشاء حساب"
    />
  );
}
