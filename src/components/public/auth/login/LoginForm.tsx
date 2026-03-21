"use client";

import { Form, FormProps } from "@/components/shared/form";
import { axios } from "@/lib/axios";
import { setAuthToken } from "@/lib/utils";
import { getUserId } from "@/lib/utils";
import { useUserStore } from "@/providers/user-store-provider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LOGIN_FORM_INPUTS, LOGIN_FORM_SCHEMA } from "./consts";

export default function LoginForm() {
  const { updateUser } = useUserStore();
  const router = useRouter();

  const onSubmit: FormProps<typeof LOGIN_FORM_SCHEMA>["onSubmit"] = async ({
    usernameoremail,
    password,
  }) => {
    const { data } = await axios.post("/auth/login", {
      usernameoremail,
      password,
    });

    const userId = getUserId(data.token);
    await setAuthToken(data.token);

    const { data: userData } = await axios.get(`/user/user?userId=${userId}`);

    updateUser({
      id: userId,
      username: data.username,
      email: data.email,
      roles: data.roles,
      token: data.token,
      picture: userData.result.profilePicture,
      bio: userData.result.bio,
      followersCount: userData.result.followersCount,
      followingCount: userData.result.followingCount,
    });

    toast.success("تم تسجيل الدخول بنجاح");
    router.push("/feed");
  };

  return (
    <Form
      schema={LOGIN_FORM_SCHEMA}
      inputs={LOGIN_FORM_INPUTS}
      onSubmit={onSubmit}
      submitLabel="تسجيل الدخول"
    />
  );
}
