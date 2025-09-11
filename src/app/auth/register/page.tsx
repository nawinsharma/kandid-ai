"use client";

import { useEffect } from "react";
import { useAuthModalContext } from "@/components/providers/auth-modal-provider";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { openAuthModal } = useAuthModalContext();
  const router = useRouter();

  useEffect(() => {
    // Open the auth modal in register mode
    openAuthModal("register");
    // Redirect to home page after opening modal
    router.push("/");
  }, [openAuthModal, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-800 p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">Opening registration...</p>
      </div>
    </div>
  );
}
