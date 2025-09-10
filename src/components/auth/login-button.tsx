"use client";

import { Button } from "@/components/ui/button";
import { useAuthModalContext } from "@/components/providers/auth-modal-provider";
import { useAuthStore } from "@/lib/store";
import { LogIn, LogOut, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface LoginButtonProps {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function LoginButton({ 
  variant = "default", 
  size = "default", 
  className = "",
  children 
}: LoginButtonProps) {
  const { openAuthModal } = useAuthModalContext();
  const { user, isLoading } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.reload();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled
      >
        <User className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {(user.name as string) || (user.email as string)}
        </span>
        <Button
          variant="outline"
          size={size}
          className={className}
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => openAuthModal("welcome")}
    >
      {children || (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </>
      )}
    </Button>
  );
}
