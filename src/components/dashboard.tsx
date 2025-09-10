"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, CheckCircle, Clock, User, Ban, Send, TrendingUp, Target, Users, Zap } from "lucide-react"
import { useDashboard } from "@/hooks/use-dashboard"
import { useRouter } from "next/navigation"

export function Dashboard() {
  const router = useRouter();
  const { data, isLoading, error } = useDashboard();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700 text-xs font-medium px-2 py-1">
            Active
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700 text-xs font-medium px-2 py-1">
            Paused
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-neutral-200 border-gray-200 dark:border-neutral-600 text-xs font-medium px-2 py-1">
            Draft
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 text-xs font-medium px-2 py-1">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-neutral-200 border-gray-200 dark:border-neutral-600 text-xs font-medium px-2 py-1">
            {status}
          </Badge>
        );
    }
  };

  const getActivityStatusBadge = (statusType: string) => {
    switch (statusType) {
      case "pending":
        return (
          <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700 text-xs font-medium px-2 py-1">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "contacted":
        return (
          <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700 text-xs font-medium px-2 py-1">
            <User className="w-3 h-3 mr-1" />
            Contacted
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
            <Ban className="w-3 h-3 mr-1" />
            Blocked
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
          <p className="text-red-600">Error loading dashboard data. Please try again.</p>
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

  const { statistics, campaigns, linkedinAccounts, recentActivity } = data || {};
  
  return (
    <div className="flex-1 space-y-8 p-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-neutral-100">{statistics?.totalCampaigns || 0}</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">{statistics?.activeCampaigns || 0} active</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-neutral-100">{statistics?.totalLeads || 0}</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">{statistics?.successfulLeads || 0} successful</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-neutral-100">{statistics?.responseRate || 0}%</p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">Overall success rate</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">Active Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
                {statistics?.totalCampaigns > 0 ? ((statistics.activeCampaigns / statistics.totalCampaigns) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">Campaigns running</p>
            </div>
            <Zap className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Campaigns and LinkedIn Accounts stacked vertically */}
        <div className="space-y-6">
          {/* Campaigns Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">Recent Campaigns</h2>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-sm"
                onClick={() => router.push('/campaigns')}
              >
                All Campaigns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
              <div className="divide-y divide-gray-100">
                {campaigns?.length > 0 ? (
                  campaigns.map((campaign: any) => (
                    <div key={campaign.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-neutral-100">{campaign.name}</span>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">{campaign.totalLeads} leads</p>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500 dark:text-neutral-400">
                    No campaigns found. Create your first campaign to get started.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn Accounts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">LinkedIn Accounts</h2>
            </div>
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
              <div className="px-6 py-3 border-b border-gray-100 dark:border-neutral-700">
                <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide">
                  <div>Account</div>
                  <div>Status</div>
                  <div>Requests</div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {linkedinAccounts?.length > 0 ? (
                  linkedinAccounts.map((account: any) => (
                    <div key={account.id} className="grid grid-cols-3 gap-4 items-center px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
                          <AvatarFallback className="text-sm bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 font-medium">
                            {account.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">{account.name}</p>
                            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">in</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{account.email}</p>
                        </div>
                      </div>
                      <div>
                        <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 text-xs font-medium px-2 py-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {account.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
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
                  <div className="px-6 py-8 text-center text-gray-500 dark:text-neutral-400">
                    No LinkedIn accounts connected.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section - Takes full right side */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">Recent Activity</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={() => router.push('/leads')}
            >
              All Leads <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg">
            <div className="px-6 py-3 border-b border-gray-100 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-700">
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide">
                <div>Lead</div>
                <div>Campaign</div>
                <div>Status</div>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-neutral-700">
              {recentActivity?.length > 0 ? (
                recentActivity.slice(0, 8).map((activity: any) => (
                  <div key={activity.id} className="grid grid-cols-3 gap-4 items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.profileImage || `/placeholder-32px.png?height=32&width=32`} />
                        <AvatarFallback className="text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 font-medium">
                          {activity.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">{activity.name}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{activity.title}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400">{activity.campaign}</div>
                    <div>
                      {getActivityStatusBadge(activity.statusType)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-neutral-400">
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
