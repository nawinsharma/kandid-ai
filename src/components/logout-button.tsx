"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full justify-start"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Sign Out
    </Button>
  );
}
