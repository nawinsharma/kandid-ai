import { create } from "zustand";
import { devtools } from "zustand/middleware";

// UI State Store
interface UIState {
  sidebarCollapsed: boolean;
  selectedLead: string | null;
  selectedCampaign: string | null;
  searchQuery: string;
  filterStatus: string;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedLead: (leadId: string | null) => void;
  setSelectedCampaign: (campaignId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarCollapsed: false,
      selectedLead: null,
      selectedCampaign: null,
      searchQuery: "",
      filterStatus: "all",
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSelectedLead: (leadId) => set({ selectedLead: leadId }),
      setSelectedCampaign: (campaignId) => set({ selectedCampaign: campaignId }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStatus: (status) => set({ filterStatus: status }),
    }),
    {
      name: "ui-store",
    }
  )
);

// Auth State Store
interface AuthState {
  user: any | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-store",
    }
  )
);
