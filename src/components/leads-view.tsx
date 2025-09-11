"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { LeadProfilePanel } from "@/components/lead-profile-panel";
import { useLeads } from "@/hooks/use-leads";
import { Skeleton } from "@/components/ui/skeleton";

function LeadsView() {
  const [selectedLead, setSelectedLead] = useState<Record<string, unknown> | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useLeads();

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
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1 h-4 rounded-sm ${
              bar <= level
                ? "bg-gray-400 dark:bg-gray-500"
                : "bg-gray-200 dark:bg-gray-600"
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
          <Badge variant="secondary" className="bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-600 text-xs">
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
    <div className="flex-1 space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-8 pt-2 sm:pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100">Leads</h1>
        </div>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">Campaign Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">Activity</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
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
                          {[1, 2, 3, 4].map((bar) => (
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
                      className="hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={(lead.profileImage as string) || `/placeholder-32px.png?height=40&width=40`} />
                            <AvatarFallback className="text-sm bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium">
                              {(lead.name as string)?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "L"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{lead.name as string}</p>
                            <p className="text-xs text-muted-foreground truncate">{lead.title as string}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{(lead.campaign as Record<string, unknown>)?.name as string || "N/A"}</span>
                      </td>
                      <td className="py-4 px-6">{renderActivityBars((lead.activity as number) || 0)}</td>
                      <td className="py-4 px-6">{getStatusBadge(lead.status as string, lead.status as string)}</td>
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
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))
            ) : (
              allLeads.map((lead: Record<string, unknown>) => (
                <div
                  key={lead.id as string}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={(lead.profileImage as string) || `/placeholder-32px.png?height=40&width=40`} />
                      <AvatarFallback className="text-sm bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium">
                        {(lead.name as string)?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "L"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{lead.name as string}</p>
                      <p className="text-xs text-muted-foreground truncate">{lead.title as string}</p>
                      <p className="text-xs text-muted-foreground truncate">{(lead.campaign as Record<string, unknown>)?.name as string || "N/A"}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {renderActivityBars((lead.activity as number) || 0)}
                      {getStatusBadge(lead.status as string, lead.status as string)}
                    </div>
                  </div>
                </div>
              ))
            )}
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
}

export { LeadsView };


