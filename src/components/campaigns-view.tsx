"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Clock, X, MessageSquare, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCampaigns } from "@/hooks/use-campaigns";
import { CreateCampaignForm } from "@/components/create-campaign-form";
import { Skeleton } from "@/components/ui/skeleton";

const CampaignsView = function CampaignsView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: campaigns, isLoading, error } = useCampaigns();

  const handleCampaignClick = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  };

  const filteredCampaigns = campaigns?.filter((campaign: Record<string, unknown>) => {
    const matchesSearch = (campaign.name as string)?.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesTab = true;
    if (activeTab === "active") {
      matchesTab = campaign.status === "active";
    } else if (activeTab === "inactive") {
      matchesTab = campaign.status !== "active";
    }
    return matchesSearch && matchesTab;
  }) || [];

  const getStatusBadge = (status: string) => {
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
  };

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
    <div className="flex-1 space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-8 pt-2 sm:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-100">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
            Manage your campaigns and track their performance
          </p>
        </div>
        <CreateCampaignForm />
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-150 dark:hover:bg-neutral-700 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">All Campaigns</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-150 dark:hover:bg-neutral-700 text-xs sm:text-sm"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="inactive" 
              className="data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-900 dark:data-[state=active]:text-neutral-100 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-150 dark:hover:bg-neutral-700 text-xs sm:text-sm"
            >
              Inactive
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-80">
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
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
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

          {/* Mobile Card View */}
          <div className="sm:hidden">
            {isLoading ? (
              // Loading skeleton for mobile
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredCampaigns.map((campaign: Record<string, unknown>) => (
                <div
                  key={campaign.id as string}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                  onClick={() => handleCampaignClick(campaign.id as string)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                        {campaign.name as string}
                      </h3>
                      {getStatusBadge(campaign.status as string)}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Users className="w-3 h-3" />
                      <span>{(campaign.totalLeads as number) || 0} leads</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <UserPlus className="w-3 h-3 text-green-500" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-yellow-500" />
                          <span>{(campaign.totalLeads as number) || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <X className="w-3 h-3 text-red-500" />
                          <span>0</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-500" />
                          <span>0</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-purple-500" />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { CampaignsView };
