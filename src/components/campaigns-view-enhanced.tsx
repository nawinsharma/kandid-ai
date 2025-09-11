"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Search, Users, Clock, X, MessageSquare, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCampaigns } from "@/hooks/use-campaigns";
import { CreateCampaignForm } from "@/components/create-campaign-form";
import { Skeleton } from "@/components/ui/skeleton";

const CampaignsViewEnhanced = memo(function CampaignsViewEnhanced() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: campaigns, isLoading, error } = useCampaigns();

  const handleCampaignClick = useCallback((campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  }, [router]);

  const filteredCampaigns = useMemo(() => {
    return campaigns?.filter((campaign: Record<string, unknown>) => {
      const matchesSearch = (campaign.name as string)?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Tab filtering
      let matchesTab = true;
      if (activeTab === "active") {
        matchesTab = campaign.status === "active";
      } else if (activeTab === "inactive") {
        matchesTab = campaign.status !== "active";
      }
      
      return matchesSearch && matchesTab;
    }) || [];
  }, [campaigns, searchQuery, activeTab]);

  const getStatusBadge = useCallback((status: string) => {
    const statusConfig = {
      active: { className: "bg-green-50 text-green-700 border-green-200", label: "Active" },
      paused: { className: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Paused" },
      draft: { className: "bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-600", label: "Draft" },
      completed: { className: "bg-blue-50 text-blue-700 border-blue-200", label: "Completed" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  }, []);

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading campaigns. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your campaigns and track their performance
          </p>
        </div>
        <CreateCampaignForm />
      </div>

      {/* Tabs and Search */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-150 dark:hover:bg-neutral-700"
            >
              All Campaigns
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-150 dark:hover:bg-neutral-700"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="inactive" 
              className="data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-150 dark:hover:bg-neutral-700"
            >
              Inactive
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-500 w-4 h-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">Campaign Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Leads</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">Request Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">Connection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-6 w-16" />
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-16" />
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredCampaigns.map((campaign: Record<string, unknown>) => (
                    <tr
                      key={campaign.id as string}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                      onClick={() => handleCampaignClick(campaign.id as string)}
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">{campaign.name as string}</div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(campaign.status as string)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">{(campaign.totalLeads as number) || 0}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <UserPlus className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">0</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{(campaign.totalLeads as number) || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <X className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">0</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">0</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">0</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export { CampaignsViewEnhanced };
