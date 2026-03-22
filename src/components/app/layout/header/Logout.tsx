"use client";

import { Button } from "@/components/ui/button";
import { clearAuthToken } from "@/lib/utils";
import { useUserStore } from "@/providers/user-store-provider";
import { DoorOpen, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUserStore();

  return (
    <Button
      variant={"destructive"}
      className={"flex items-center justify-between"}
      onClick={async () => {
        setLoading(true);
        await clearAuthToken();
        updateUser(null);
        setLoading(false);
        router.replace("/login");
      }}
    >
      تسجيل الخروج {loading ? <Loader2 /> : <DoorOpen />}
    </Button>
  );
}
