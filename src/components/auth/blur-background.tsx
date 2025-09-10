"use client";

import { useAuthModal } from "@/hooks/use-auth-modal";

interface BlurBackgroundProps {
  children: React.ReactNode;
}

export function BlurBackground({ children }: BlurBackgroundProps) {
  const { isOpen } = useAuthModal();

  return (
    <div className={`transition-all duration-500 ${isOpen ? 'blur-3xl brightness-50' : ''}`}>
      {children}
    </div>
  );
}
