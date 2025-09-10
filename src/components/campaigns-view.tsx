"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Users, CheckCircle, Clock, XCircle, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

const campaignsData = [
  {
    id: "just-herbs",
    name: "Just Herbs",
    status: "Active",
    totalLeads: 20,
    requestSent: 0,
    requestAccepted: 20,
    requestRejected: 0,
    connectionSent: 0,
    connectionAccepted: 0,
  },
  {
    id: "juicy-chemistry",
    name: "Juicy chemistry",
    status: "Active",
    totalLeads: 11,
    requestSent: 0,
    requestAccepted: 11,
    requestRejected: 0,
    connectionSent: 0,
    connectionAccepted: 0,
  },
  {
    id: "hyugalife-2",
    name: "Hyugalife 2",
    status: "Active",
    totalLeads: 19,
    requestSent: 0,
    requestAccepted: 19,
    requestRejected: 0,
    connectionSent: 0,
    connectionAccepted: 0,
  },
  {
    id: "honeyveda",
    name: "Honeyveda",
    status: "Active",
    totalLeads: 3,
    requestSent: 0,
    requestAccepted: 3,
    requestRejected: 0,
    connectionSent: 0,
    connectionAccepted: 0,
  },
  {
    id: "hempstreet",
    name: "HempStreet",
    status: "Active",
    totalLeads: 7,
    requestSent: 0,
    requestAccepted: 7,
    requestRejected: 0,
    connectionSent: 0,
    connectionAccepted: 0,
  },
  {
    id: "healthyhey-2",
    name: "HealthyHey 2",
    status: "Active",
    totalLeads: 5,
    requestSent: 0,
    requestAccepted: 5,
    requestRejected: 0,
    connectionSent: 0,
    connectionAccepted: 0,
  },
  {
    id: "herbal-chakra",
    name: "Herbal Chakra",
    status: "Active",
    totalLeads: 19,
    requestSent: 0,
    requestAccepted: 19,
    requestRejected: 0,
    connectionSent: 0,
    connectionAccepted: 0,
  },
  {
    id: "healofy",
    name: "Healofy",
    status: "Active",
    totalLeads: 14,
    requestSent: 0,
    requestAccepted: 14,
    requestRejected: 0,
    connectionSent: 0,
    connectionAccepted: 0,
  },
  {
    id: "healthsense",
    name: "HealthSense",
    status: "Active",
    totalLeads: 2,
    requestSent: 0,
    requestAccepted: 2,
    requestRejected: 0,
    connectionSent: 0,
    connectionAccepted: 0,
  },
]

export function CampaignsView() {
  const router = useRouter()

  const handleCampaignClick = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`)
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
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your campaigns and track their performance</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Tabs and Search */}
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-neutral-500 w-4 h-4" />
          <Input placeholder="Search campaigns..." className="pl-10 bg-white dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-gray-900 dark:text-neutral-100" />
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
                {campaignsData.map((campaign, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                    onClick={() => handleCampaignClick(campaign.id)}
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">{campaign.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700">
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400 dark:text-neutral-500" />
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{campaign.totalLeads}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">{campaign.requestSent}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">{campaign.requestAccepted}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">{campaign.requestRejected}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{campaign.connectionSent}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-gray-600">{campaign.connectionAccepted}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
