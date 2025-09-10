"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/lib/store";
import { authClient } from "@/lib/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  const checkAuth = useCallback(async () => {
    try {
      const session = await authClient.getSession();
      setUser(session.data?.user || null);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  useEffect(() => {
    checkAuth();
    
    // Listen for storage events to detect auth changes
    const handleStorageChange = () => {
      checkAuth();
    };
    
    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);
    
    // Also check auth periodically in case of missed events
    const interval = setInterval(() => {
      checkAuth();
    }, 5000); // Check every 5 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
      clearInterval(interval);
    };
  }, [checkAuth]);

  useEffect(() => {
    (window as Window & { refreshAuth?: () => void }).refreshAuth = checkAuth;
    return () => {
      delete (window as Window & { refreshAuth?: () => void }).refreshAuth;
    };
  }, [checkAuth]);

  return <>{children}</>;
}
