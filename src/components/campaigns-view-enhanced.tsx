"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Users, TrendingUp, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCampaigns } from "@/hooks/use-campaigns";
import { CreateCampaignForm } from "@/components/create-campaign-form";
import { Skeleton } from "@/components/ui/skeleton";

const CampaignsViewEnhanced = memo(function CampaignsViewEnhanced() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: campaigns, isLoading, error } = useCampaigns();

  const handleCampaignClick = useCallback((campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  }, [router]);

  const filteredCampaigns = useMemo(() => {
    return campaigns?.filter((campaign: Record<string, unknown>) => {
      const matchesSearch = (campaign.name as string)?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      
      // Tab filtering
      let matchesTab = true;
      if (activeTab === "active") {
        matchesTab = campaign.status === "active";
      } else if (activeTab === "inactive") {
        matchesTab = campaign.status !== "active";
      }
      
      return matchesSearch && matchesStatus && matchesTab;
    }) || [];
  }, [campaigns, searchQuery, statusFilter, activeTab]);

  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "responseRate") {
        aValue = parseFloat((aValue as string) || "0");
        bValue = parseFloat((bValue as string) || "0");
      }
      
      if (sortOrder === "asc") {
        return (aValue as number) > (bValue as number) ? 1 : -1;
      } else {
        return (aValue as number) < (bValue as number) ? 1 : -1;
      }
    });
  }, [filteredCampaigns, sortBy, sortOrder]);

  // Calculate overall statistics
  const statistics = useMemo(() => {
    const totalCampaigns = campaigns?.length || 0;
    const activeCampaigns = campaigns?.filter((c: Record<string, unknown>) => c.status === "active").length || 0;
    const totalLeads = campaigns?.reduce((sum: number, c: Record<string, unknown>) => sum + ((c.totalLeads as number) || 0), 0) || 0;
    const totalSuccessfulLeads = campaigns?.reduce((sum: number, c: Record<string, unknown>) => sum + ((c.successfulLeads as number) || 0), 0) || 0;
    const overallResponseRate = totalLeads > 0 ? (totalSuccessfulLeads / totalLeads) * 100 : 0;
    
    return {
      totalCampaigns,
      activeCampaigns,
      totalLeads,
      totalSuccessfulLeads,
      overallResponseRate,
    };
  }, [campaigns]);

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
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <span>Campaign</span>
      </div>

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

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.activeCampaigns} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.totalSuccessfulLeads} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.overallResponseRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rate</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.totalCampaigns > 0 ? ((statistics.activeCampaigns / statistics.totalCampaigns) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Campaigns running
            </p>
          </CardContent>
        </Card>
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

        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-500 w-4 h-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-white dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-gray-900 dark:text-neutral-100">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    <button
                      className="flex items-center gap-2 hover:text-neutral-700 dark:hover:text-neutral-300"
                      onClick={() => {
                        if (sortBy === "name") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("name");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      Campaign Name
                      {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    <button
                      className="flex items-center gap-2 hover:text-neutral-700 dark:hover:text-neutral-300"
                      onClick={() => {
                        if (sortBy === "status") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("status");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      Status
                      {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    <button
                      className="flex items-center gap-2 hover:text-neutral-700 dark:hover:text-neutral-300"
                      onClick={() => {
                        if (sortBy === "totalLeads") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("totalLeads");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      Total Leads
                      {sortBy === "totalLeads" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    <button
                      className="flex items-center gap-2 hover:text-neutral-700 dark:hover:text-neutral-300"
                      onClick={() => {
                        if (sortBy === "responseRate") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("responseRate");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      Response Rate
                      {sortBy === "responseRate" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">Progress</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    <button
                      className="flex items-center gap-2 hover:text-neutral-700 dark:hover:text-neutral-300"
                      onClick={() => {
                        if (sortBy === "createdAt") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("createdAt");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      Created Date
                      {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                  </th>
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
                        <Skeleton className="h-2 w-24" />
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-20" />
                      </td>
                    </tr>
                  ))
                ) : (
                  sortedCampaigns.map((campaign: Record<string, unknown>) => (
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
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {parseFloat((campaign.responseRate as string) || "0").toFixed(1)}%
                          </span>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            ({(campaign.successfulLeads as number) || 0}/{(campaign.totalLeads as number) || 0})
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-24">
                          <Progress 
                            value={parseFloat((campaign.responseRate as string) || "0")} 
                            className="h-2"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {new Date(campaign.createdAt as string).toLocaleDateString()}
                        </span>
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
