"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/lib/store";
import { authClient } from "@/lib/auth-client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  const checkAuth = useCallback(async () => {
    try {
      console.log("🔍 AuthProvider: Checking session...");
      console.log("🔍 AuthProvider: Document cookies:", document.cookie);
      const session = await authClient.getSession();
      console.log("🔍 AuthProvider: Session result:", session);
      console.log("🔍 AuthProvider: Session data:", session.data);
      console.log("🔍 AuthProvider: User data:", session.data?.user);
      console.log("🔍 AuthProvider: Session error:", session.error);
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
      console.log("🔍 AuthProvider: Storage change detected, rechecking session...");
      checkAuth();
    };
    
    // Listen for custom auth events
    const handleAuthChange = () => {
      console.log("🔍 AuthProvider: Auth change event detected, rechecking session...");
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

  // Expose checkAuth function globally for manual refresh
  useEffect(() => {
    (window as Window & { refreshAuth?: () => void }).refreshAuth = checkAuth;
    return () => {
      delete (window as Window & { refreshAuth?: () => void }).refreshAuth;
    };
  }, [checkAuth]);

  return <>{children}</>;
}
