"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useAuthModalContext } from "@/components/providers/auth-modal-provider";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, isLoading } = useAuthStore();
  const { openAuthModal } = useAuthModalContext();
  const { isOpen } = useAuthModal();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      // Redirect to dashboard if user is authenticated
      router.push("/dashboard");
    } else if (!user && !isLoading) {
      // Show login modal if user is not authenticated
      openAuthModal("welcome");
    }
  }, [user, isLoading, router, openAuthModal]);

  // Always show loading state while checking authentication
  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${isOpen ? 'blur-md brightness-50' : ''}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}