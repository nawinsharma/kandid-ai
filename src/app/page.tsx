"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useAuthModalContext } from "@/components/providers/auth-modal-provider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, isLoading } = useAuthStore();
  const { openAuthModal } = useAuthModalContext();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard");
    } else if (!user && !isLoading) {
      openAuthModal("login");
    }
  }, [user, isLoading, router, openAuthModal]);

  if (isLoading) {
    return null;
  }

  return (
    <div />
  );
}