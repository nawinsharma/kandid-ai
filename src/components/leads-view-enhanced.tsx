"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MoreHorizontal, Loader2 } from "lucide-react";
import { LeadProfilePanel } from "@/components/lead-profile-panel";
import { useLeads } from "@/hooks/use-leads";
import { useUIStore } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";

const LeadsViewEnhanced = memo(function LeadsViewEnhanced() {
  const [selectedLead, setSelectedLead] = useState<Record<string, unknown> | null>(null);
  const { searchQuery, filterStatus, setSearchQuery, setFilterStatus } = useUIStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useLeads();

  // Debounced search
  const [searchInput, setSearchInput] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setSearchQuery]);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000
    ) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const renderActivityBars = useCallback((level: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className={`w-1 h-4 rounded-sm ${
              bar <= level
                ? level <= 2
                  ? "bg-blue-500"
                  : level <= 3
                    ? "bg-yellow-500"
                    : level <= 4
                      ? "bg-orange-500"
                      : "bg-purple-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    );
  }, []);

  const getStatusBadge = useCallback((statusType: string, status: string) => {
    switch (statusType) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
            Pending Approval
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
            Sent 7 mins ago
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
            Do Not Contact
          </Badge>
        );
      case "followup":
        return (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            Followup 10 mins ago
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        );
    }
  }, []);

  const allLeads = useMemo(() => data?.pages.flatMap((page) => page.leads) || [], [data]);

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="text-center py-12">
          <p className="text-red-600">Error loading leads. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <span>Leads</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track your leads across all campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search leads..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Campaign Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Activity</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index}>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((bar) => (
                            <Skeleton key={bar} className="w-1 h-4" />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-6 w-20" />
                      </td>
                    </tr>
                  ))
                ) : (
                  allLeads.map((lead: Record<string, unknown>) => (
                    <tr
                      key={lead.id as string}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder-32px.png?height=40&width=40`} />
                            <AvatarFallback className="text-sm bg-gray-100 text-gray-600 font-medium">
                              {(lead.name as string)?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "L"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">{lead.name as string}</p>
                            <p className="text-xs text-muted-foreground truncate">{lead.title as string}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">{(lead.campaign as Record<string, unknown>)?.name as string || "N/A"}</span>
                      </td>
                      <td className="py-4 px-6">{renderActivityBars((lead.activity as number) || 0)}</td>
                      <td className="py-4 px-6">{getStatusBadge(lead.status as string, lead.status as string)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {/* Lead Profile Panel */}
      {selectedLead && (
        <LeadProfilePanel
          lead={selectedLead as Record<string, unknown> & { id: string; name: string; title: string; company: string; campaign: string; status: string; statusType: string; activity: number; avatar: string; lastContact: string | null }}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
});

export { LeadsViewEnhanced };
