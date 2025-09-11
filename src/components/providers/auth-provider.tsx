"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store";
import { authClient } from "@/lib/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const checkAuthRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    checkAuthRef.current = async () => {
      try {
        const session = await authClient.getSession({
          fetchOptions: { cache: "no-store" },
        });
        setUser(session.data?.user || null);
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  }, [setUser, setLoading]);

  useEffect(() => {
    checkAuthRef.current?.();
  }, []);

  useEffect(() => {
    (window as Window & { refreshAuth?: () => void }).refreshAuth = () => {
      return checkAuthRef.current?.();
    };
    return () => {
      delete (window as Window & { refreshAuth?: () => void }).refreshAuth;
    };
  }, []);

  return <>{children}</>;
}
