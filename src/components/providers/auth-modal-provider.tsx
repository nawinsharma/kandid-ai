"use client";

import { createContext, useContext, ReactNode } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { BlurBackground } from "@/components/auth/blur-background";
import { useAuthModal } from "@/hooks/use-auth-modal";

interface AuthModalContextType {
  openAuthModal: (mode?: "welcome" | "login" | "register") => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function useAuthModalContext() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModalContext must be used within an AuthModalProvider");
  }
  return context;
}

interface AuthModalProviderProps {
  children: ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const { isOpen, mode, openModal, closeModal } = useAuthModal();

  const openAuthModal = (newMode: "welcome" | "login" | "register" = "welcome") => {
    openModal(newMode);
  };

  const closeAuthModal = () => {
    closeModal();
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      <BlurBackground>
        {children}
      </BlurBackground>
      <AuthModal
        isOpen={isOpen}
        onClose={closeAuthModal}
        initialMode={mode}
      />
    </AuthModalContext.Provider>
  );
}
