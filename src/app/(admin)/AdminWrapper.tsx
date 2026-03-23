"use client";

import { useEffect } from "react";
import { useUserStore } from "@/providers/user-store-provider";
import { useRouter } from "next/navigation";

export default function AdminWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isHydratingUser } = useUserStore();
  const router = useRouter();
  const isAdmin = user?.roles?.includes("Admin");

  useEffect(() => {
    if (!isHydratingUser && !isAdmin) {
      router.replace("/feed");
    }
  }, [isAdmin, isHydratingUser, router]);

  if (isHydratingUser || !isAdmin) {
    return null;
  }

  return children;
}
