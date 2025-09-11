"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Clock, User } from "lucide-react"
import { useDashboard } from "@/hooks/use-dashboard"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Dashboard() {
  const router = useRouter();
  const { data, isLoading, error } = useDashboard();

  const { campaigns, linkedinAccounts, recentActivity } = data || {};

  const [campaignStatusFilter, setCampaignStatusFilter] = useState<string>("all")
  const [activityFilter, setActivityFilter] = useState<string>("most_recent")

  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return []
    if (campaignStatusFilter === "all") return campaigns
    return campaigns.filter((c: { status: string }) => c.status === campaignStatusFilter)
  }, [campaigns, campaignStatusFilter])

  const processedRecentActivity = useMemo(() => {
    if (!recentActivity) return []
    if (activityFilter === "most_recent") {
      return [...recentActivity].sort((a: { updatedAt?: string }, b: { updatedAt?: string }) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return bTime - aTime
      })
    }
    if (activityFilter === "oldest") {
      return [...recentActivity].sort((a: { updatedAt?: string }, b: { updatedAt?: string }) => {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return aTime - bTime
      })
    }
    return recentActivity.filter((ra: { statusType: string }) => ra.statusType === activityFilter)
  }, [recentActivity, activityFilter])


  const getActivityStatusBadge = (statusType: string) => {
    switch (statusType) {
      case "pending":
        return (
          <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700 text-xs font-medium px-2 py-1">
            <Clock className="w-3 h-3 mr-1" />
            Pending Approval
          </Badge>
        );
      case "contacted":
        return (
          <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700 text-xs font-medium px-2 py-1">
            <User className="w-3 h-3 mr-1" />
            Sent 7 mins ago
          </Badge>
        );
      case "responded":
        return (
          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700 text-xs font-medium px-2 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Responded
          </Badge>
        );
      case "converted":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 text-xs font-medium px-2 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Converted
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-neutral-200 border-gray-200 dark:border-neutral-600 text-xs font-medium px-2 py-1">
            Do Not Contact
          </Badge>
        );
      case "followup":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 text-xs font-medium px-2 py-1">
            <span className="mr-1">✈️</span>
            Followup 10 mins ago
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-neutral-200 border-gray-200 dark:border-neutral-600 text-xs font-medium px-2 py-1">
            {statusType}
          </Badge>
        );
    }
  };

  if (error) {
    return (
      <div className="flex-1 space-y-8 p-6">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">Error loading dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-8 p-6">
        {/* Statistics Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-700">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 px-6 py-4 border-b border-gray-100 dark:border-neutral-700">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 sm:space-y-8 p-2 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-100 hidden sm:block">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column - Campaigns and LinkedIn Accounts stacked vertically */}
        <div className="space-y-4 sm:space-y-6">
          {/* Campaigns Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-neutral-100">Campaigns</h2>
              <div className="hidden sm:flex items-center gap-2">
                <Select value={campaignStatusFilter} onValueChange={setCampaignStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                  onClick={() => router.push('/campaigns')}
                >
                  View All
                </Button>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
              <div className="divide-y divide-gray-100 dark:divide-neutral-700">
                {filteredCampaigns?.length > 0 ? (
                  filteredCampaigns.map((campaign: { id: string; name: string; totalLeads: number; status: string }) => (
                    <div key={campaign.id} className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{campaign.name}</span>
                      </div>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700 text-xs font-medium px-2 py-1 ml-2">
                        Active
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="px-3 sm:px-6 py-6 sm:py-8 text-center text-gray-500 dark:text-neutral-400 text-sm">
                    No campaigns found. Create your first campaign to get started.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn Accounts Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-neutral-100">LinkedIn Accounts</h2>
            </div>
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
              <div className="px-3 sm:px-6 py-3 border-b border-gray-100 dark:border-neutral-700">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide">
                  <div>Account</div>
                  <div className="hidden sm:block">Status</div>
                  <div className="hidden sm:block">Requests</div>
                </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-neutral-700">
                {linkedinAccounts?.length > 0 ? (
                  linkedinAccounts.map((account: { id: string; name: string; email: string; status: string; requestsSent: number; requestsLimit: number; progress: number | string }) => (
                    <div key={account.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${encodeURIComponent(account.email || account.name)}`} />
                          <AvatarFallback className="text-xs sm:text-sm bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 font-medium">
                            {account.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{account.name}</p>
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">in</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{account.email}</p>
                        </div>
                      </div>
                      <div className="sm:block">
                        {account.status === 'connected' ? (
                          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 text-xs font-medium px-2 py-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        ) : account.status === 'disconnected' ? (
                          <Badge className="bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-neutral-200 border-gray-200 dark:border-neutral-600 text-xs font-medium px-2 py-1">Disconnected</Badge>
                        ) : (
                          <Badge className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700 text-xs font-medium px-2 py-1">Error</Badge>
                        )}
                      </div>
                      <div className="space-y-2 sm:block">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-900 dark:text-neutral-100">
                            {account.requestsSent}/{account.requestsLimit}
                          </span>
                        </div>
                        <Progress value={Number(account.progress)} className="h-2 bg-gray-100 dark:bg-neutral-700" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 sm:px-6 py-6 sm:py-8 text-center text-gray-500 dark:text-neutral-400 text-sm">
                    No LinkedIn accounts connected.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section - Takes full right side */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-neutral-100">Recent Activity</h2>
            <div className="hidden sm:flex items-center gap-2">
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Sort / filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="most_recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => router.push('/leads')}
              >
                View Leads
              </Button>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
            <div className="px-3 sm:px-6 py-3 border-b border-gray-100 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide">
                <div>Lead</div>
                <div className="hidden sm:block">Campaign</div>
                <div className="hidden sm:block">Status</div>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-neutral-700">
              {processedRecentActivity?.length > 0 ? (
                processedRecentActivity.slice(0, 8).map((activity: { id: string; name: string; title: string; campaign: string; statusType: string; profileImage?: string }) => (
                  <div key={activity.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 items-center px-3 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarImage src={activity.profileImage || `/placeholder-32px.png?height=32&width=32`} />
                        <AvatarFallback className="text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 font-medium">
                          {activity.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{activity.name}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{activity.title}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 truncate sm:hidden">{activity.campaign}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400 hidden sm:block">{activity.campaign}</div>
                    <div className="sm:block">
                      {getActivityStatusBadge(activity.statusType)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 sm:px-6 py-6 sm:py-8 text-center text-gray-500 dark:text-neutral-400 text-sm">
                  No recent activity. Start creating leads to see activity here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
