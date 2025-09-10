"use client";

import { useState, useCallback } from "react";

type AuthMode = "welcome" | "login" | "register";

interface UseAuthModalReturn {
  isOpen: boolean;
  mode: AuthMode;
  openModal: (mode?: AuthMode) => void;
  closeModal: () => void;
  setMode: (mode: AuthMode) => void;
}

export function useAuthModal(): UseAuthModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("welcome");

  const openModal = useCallback((newMode: AuthMode = "welcome") => {
    setMode(newMode);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Reset to welcome mode after a short delay to allow for smooth transitions
    setTimeout(() => setMode("welcome"), 200);
  }, []);

  return {
    isOpen,
    mode,
    openModal,
    closeModal,
    setMode,
  };
}
