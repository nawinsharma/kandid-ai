"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Filter, MoreHorizontal } from "lucide-react"
import { LeadProfilePanel } from "@/components/lead-profile-panel"

const leadsData = [
  {
    id: "1",
    name: "Om Satyarthy",
    title: "Regional Head",
    company: "Gynoveda",
    campaign: "Gynoveda",
    status: "Pending Approval",
    statusType: "pending",
    activity: 3,
    avatar: "OS",
    lastContact: null,
  },
  {
    id: "2",
    name: "Dr. Bhuvaneshwari",
    title: "Fertility & Women's Health ♀ A...",
    company: "Gynoveda",
    campaign: "Gynoveda",
    status: "Sent 7 mins ago",
    statusType: "sent",
    activity: 4,
    avatar: "DB",
    lastContact: "7 mins ago",
  },
  {
    id: "3",
    name: "Surdeep Singh",
    title: "Building Product-led SEO Growt...",
    company: "Gynoveda",
    campaign: "Gynoveda",
    status: "Sent 7 mins ago",
    statusType: "sent",
    activity: 4,
    avatar: "SS",
    lastContact: "7 mins ago",
  },
  {
    id: "4",
    name: "Dilbag Singh",
    title: "Manager Marketing & Communicat...",
    company: "Gynoveda",
    campaign: "Gynoveda",
    status: "Sent 7 mins ago",
    statusType: "sent",
    activity: 4,
    avatar: "DS",
    lastContact: "7 mins ago",
  },
  {
    id: "5",
    name: "Vanshy Jain",
    title: "Ayurveda||primary infertility||...",
    company: "Gynoveda",
    campaign: "Gynoveda",
    status: "Sent 7 mins ago",
    statusType: "sent",
    activity: 4,
    avatar: "VJ",
    lastContact: "7 mins ago",
  },
  {
    id: "6",
    name: "Sunil Pal",
    title: "Helping Fashion & Lifestyle Br...",
    company: "Digi Sidekick",
    campaign: "Digi Sidekick",
    status: "Pending Approval",
    statusType: "pending",
    activity: 3,
    avatar: "SP",
    lastContact: null,
  },
  {
    id: "7",
    name: "Utkarsh K.",
    title: "Airbnb Host | Ex-The Skin Stor...",
    company: "The skin story",
    campaign: "The skin story",
    status: "Do Not Contact",
    statusType: "blocked",
    activity: 5,
    avatar: "UK",
    lastContact: null,
  },
  {
    id: "8",
    name: "Shreya Ramakrishna",
    title: "Deputy Manager - Founder's Off...",
    company: "Pokonut",
    campaign: "Pokonut",
    status: "Followup 10 mins ago",
    statusType: "followup",
    activity: 2,
    avatar: "SR",
    lastContact: "10 mins ago",
  },
  {
    id: "9",
    name: "Deepak Kumar",
    title: "Deputy manager Advertising and...",
    company: "Re'equil",
    campaign: "Re'equil",
    status: "Followup 10 mins ago",
    statusType: "followup",
    activity: 2,
    avatar: "DK",
    lastContact: "10 mins ago",
  },
]

export function LeadsView() {
  const [selectedLead, setSelectedLead] = useState<(typeof leadsData)[0] | null>(null)

  const renderActivityBars = (level: number) => {
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
    )
  }

  const getStatusBadge = (statusType: string, status: string) => {
    switch (statusType) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
            Pending Approval
          </Badge>
        )
      case "sent":
        return (
          <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
            Sent 7 mins ago
          </Badge>
        )
      case "blocked":
        return (
          <Badge variant="secondary" className="bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 border-gray-200 dark:border-neutral-600 text-xs">
            Do Not Contact
          </Badge>
        )
      case "followup":
        return (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            Followup 10 mins ago
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        )
    }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your leads across all campaigns</p>
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

      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-500 w-4 h-4" />
        <Input placeholder="Search leads..." className="pl-10 bg-white dark:bg-neutral-700 border-gray-200 dark:border-neutral-600 text-gray-900 dark:text-neutral-100" />
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-neutral-400">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-neutral-400">Campaign Name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-neutral-400">Activity</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leadsData.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder-32px.png?height=40&width=40`} />
                          <AvatarFallback className="text-sm bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 font-medium">
                            {lead.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">{lead.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{lead.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600 dark:text-neutral-400">{lead.campaign}</span>
                    </td>
                    <td className="py-4 px-6">{renderActivityBars(lead.activity)}</td>
                    <td className="py-4 px-6">{getStatusBadge(lead.statusType, lead.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Lead Profile Panel */}
      {selectedLead && (
        <LeadProfilePanel lead={selectedLead} isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  )
}
