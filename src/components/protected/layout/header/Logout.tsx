"use client";

import { Button } from "@/components/ui/button";
import { clearAuthToken } from "@/lib/utils";
import { DoorOpen, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant={"destructive"}
      className={"flex items-center justify-between"}
      onClick={async () => {
        setLoading(true);
        await clearAuthToken();
        setLoading(false);
        router.replace("/login");
      }}
    >
      تسجيل الخروج {loading ? <Loader2 /> : <DoorOpen />}
    </Button>
  );
}
