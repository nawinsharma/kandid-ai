import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface SeedUserResponse {
  success: boolean;
  message: string;
  data?: {
    linkedinAccounts: number;
    campaigns: number;
    leads: number;
  };
}

async function seedUserData(): Promise<SeedUserResponse> {
  const response = await fetch("/api/seed-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to seed user data");
  }

  return response.json();
}

export function useSeedUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: seedUserData,
    onSuccess: (data) => {
      if (data.success) {
        console.log("✅ User data seeded successfully:", data);
        toast.success("Welcome! Your account has been set up with sample data.");
        
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        queryClient.invalidateQueries({ queryKey: ["leads"] });
        queryClient.invalidateQueries({ queryKey: ["linkedin-accounts"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      } else {
        console.log("User already has data or seeding was skipped");
      }
    },
    onError: (error) => {
      console.error("❌ Error seeding user data:", error);
      toast.error("Failed to set up your account. Please try refreshing the page.");
    },
  });
}
