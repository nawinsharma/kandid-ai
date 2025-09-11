import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    staleTime: 1000 * 60, // 1 minute cache
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      return response.json();
    },
  });
}
