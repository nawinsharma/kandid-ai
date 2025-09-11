"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Mail, MessageSquare, RotateCcw, Info, Clock, ChevronDown } from "lucide-react"
import { LeadProfilePanel } from "@/components/lead-profile-panel"
import { useCampaign } from "@/hooks/use-campaigns"
import { Skeleton } from "@/components/ui/skeleton"

interface CampaignDetailsProps {
  campaignId: string
}

interface Lead {
  id: string;
  name: string;
  email?: string;
  title: string;
  company: string;
  linkedinUrl?: string;
  profileImage?: string;
  status: string;
  activity: number;
  lastContactDate?: string;
  createdAt: string;
  // Additional fields for LeadProfilePanel compatibility
  campaign: string;
  statusType: string;
  avatar: string;
  lastContact: string | null;
}

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { className: "bg-orange-50 text-orange-700 border-orange-200", label: "Pending", icon: Clock },
    contacted: { className: "bg-blue-50 text-blue-700 border-blue-200", label: "Contacted", icon: null },
    responded: { className: "bg-green-50 text-green-700 border-green-200", label: "Responded", icon: null },
    converted: { className: "bg-purple-50 text-purple-700 border-purple-200", label: "Converted", icon: null },
    blocked: { className: "bg-red-50 text-red-700 border-red-200", label: "Blocked", icon: null },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <Badge variant="secondary" className={`${config.className} text-xs`}>
      {config.icon && <config.icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
};

export function CampaignDetails({ campaignId }: CampaignDetailsProps) {
  const { data: campaign, isLoading, error } = useCampaign(campaignId);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const [requestMessage, setRequestMessage] = useState(
    campaign?.requestMessage || "Hi {{firstName}}, I'm building consultative AI salespersons for personal care brands with the guarantee to boost your b2c revenue by min of 2%. Would love to connect if you're open to exploring this for Just Herbs!",
  );
  const [connectionMessage, setConnectionMessage] = useState(
    campaign?.connectionMessage || "Awesome to connect, {{firstName}}! Allow me to explain Kandid a bit: So these are consultative salespersons that engage with visitors like an offline store salesperson does. It helps them with product recommendations based on their preferences/concerns. Here's a video to help you visualise it better: https://youtu.be/331XRg-vPo",
  );

  // Update messages when campaign data loads
  if (campaign && !requestMessage) {
    setRequestMessage(campaign.requestMessage || "");
  }
  if (campaign && !connectionMessage) {
    setConnectionMessage(campaign.connectionMessage || "");
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading campaign details. Please try again.</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Campaign not found.</p>
      </div>
    );
  }

  const availableFields = [
    { field: "{{fullName}}", description: "Full Name" },
    { field: "{{firstName}}", description: "First Name" },
    { field: "{{lastName}}", description: "Last Name" },
    { field: "{{jobTitle}}", description: "Job Title" },
  ]

  const insertField = (field: string, messageType: "request" | "connection") => {
    if (messageType === "request") {
      const textarea = document.getElementById("request-message") as HTMLTextAreaElement
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newMessage = requestMessage.substring(0, start) + field + requestMessage.substring(end)
        setRequestMessage(newMessage)
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(start + field.length, start + field.length)
        }, 0)
      }
    } else {
      const textarea = document.getElementById("connection-message") as HTMLTextAreaElement
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const newMessage = connectionMessage.substring(0, start) + field + connectionMessage.substring(end)
        setConnectionMessage(newMessage)
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(start + field.length, start + field.length)
        }, 0)
      }
    }
  }

  const renderActivityBars = (level: number) => {
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
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100">Campaign Details</h1>
          <p className="text-sm text-muted-foreground mt-1 hidden sm:block">Manage and track your campaign performance</p>
        </div>
        <Badge variant="secondary" className={
          campaign.status === 'active' 
            ? "bg-green-50 text-green-700 border-green-200" 
            : campaign.status === 'paused'
            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : campaign.status === 'completed'
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-gray-50 text-gray-700 border-gray-200"
        }>
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="inline-flex h-auto items-center justify-start bg-transparent p-0 border-0 shadow-none overflow-x-auto">
          <TabsTrigger value="overview" className="inline-flex items-center justify-center whitespace-nowrap px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium border-0 border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:text-purple-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-gray-900 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-0 text-gray-600 rounded-none">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded border border-gray-400 bg-white mr-1 sm:mr-2 flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400"></div>
            </div>
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="leads" className="inline-flex items-center justify-center whitespace-nowrap px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium border-0 border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:text-purple-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-gray-900 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-0 text-gray-600 rounded-none">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="sequence" className="inline-flex items-center justify-center whitespace-nowrap px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium border-0 border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:text-purple-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-gray-900 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-0 text-gray-600 rounded-none">
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Sequence</span>
            <span className="sm:hidden">Seq</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="inline-flex items-center justify-center whitespace-nowrap px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium border-0 border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-400 data-[state=active]:text-purple-400 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-gray-900 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-0 text-gray-600 rounded-none">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded border border-gray-400 bg-white mr-1 sm:mr-2 flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400"></div>
            </div>
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.statistics?.totalLeads || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Contacted</CardTitle>
                <Mail className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.statistics?.contactedLeads || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Responded</CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.statistics?.respondedLeads || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Converted</CardTitle>
                <RotateCcw className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaign.statistics?.convertedLeads || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            {/* Campaign Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Campaign Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Leads Contacted</span>
                    <span>{campaign.statistics?.contactRate || 0}%</span>
                  </div>
                  <Progress value={parseFloat(campaign.statistics?.contactRate || "0")} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Rate</span>
                    <span>{campaign.statistics?.responseRate || 0}%</span>
                  </div>
                  <Progress value={parseFloat(campaign.statistics?.responseRate || "0")} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Conversion Rate</span>
                    <span>{campaign.statistics?.conversionRate || 0}%</span>
                  </div>
                  <Progress value={parseFloat(campaign.statistics?.conversionRate || "0")} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold">Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Start Date:</span>
                  <span className="text-sm font-medium">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="secondary" className={
                    campaign.status === 'active' 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : campaign.status === 'paused'
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : campaign.status === 'completed'
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Conversion Rate:</span>
                  <span className="text-sm font-medium">{campaign.statistics?.conversionRate || 0}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardContent className="p-0">
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-700">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          Name
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-neutral-400">Lead Description</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-neutral-400">Activity</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          Status
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                    {campaign.leads && campaign.leads.length > 0 ? (
                      campaign.leads.map((lead: Lead) => (
                        <tr
                          key={lead.id}
                          className="hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                          onClick={() => setSelectedLead({
                            ...lead,
                            title: lead.title || 'No title',
                            company: lead.company || 'No company',
                            campaign: campaign.name,
                            statusType: lead.status,
                            avatar: lead.name ? lead.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : '??',
                            lastContact: lead.lastContactDate || null,
                          })}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={lead.profileImage || `/placeholder-32px.png?height=40&width=40`} />
                                <AvatarFallback className="text-sm bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 font-medium">
                                  {lead.name ? lead.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : '??'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">{lead.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-600 dark:text-neutral-400">{lead.title || 'No title'}</span>
                          </td>
                          <td className="py-4 px-6">{renderActivityBars(lead.activity || 0)}</td>
                          <td className="py-4 px-6">
                            {getStatusBadge(lead.status)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 px-6 text-center text-gray-500 dark:text-neutral-400">
                          No leads found for this campaign.
                        </td>
                      </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden">
            {campaign.leads && campaign.leads.length > 0 ? (
              campaign.leads.map((lead: Lead) => (
                <div
                  key={lead.id}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
                  onClick={() => setSelectedLead({
                    ...lead,
                    title: lead.title || 'No title',
                    company: lead.company || 'No company',
                    campaign: campaign.name,
                    statusType: lead.status,
                    avatar: lead.name ? lead.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : '??',
                    lastContact: lead.lastContactDate || null,
                  })}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={lead.profileImage || `/placeholder-32px.png?height=40&width=40`} />
                      <AvatarFallback className="text-sm bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 font-medium">
                        {lead.name ? lead.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">{lead.name}</p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{lead.title || 'No title'}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {renderActivityBars(lead.activity || 0)}
                      {getStatusBadge(lead.status)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-neutral-400 text-sm">
                No leads found for this campaign.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="sequence" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Request Message */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base sm:text-lg font-semibold">Request Message</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 hidden sm:block">Edit your request message here.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                    Preview
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                    Save
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3 block">Available fields:</Label>
                  <div className="space-y-2">
                    {availableFields.map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-neutral-700 rounded">
                        <div>
                          <code className="text-sm font-mono text-blue-600">{field.field}</code>
                          <span className="text-sm text-gray-600 dark:text-neutral-400 ml-2">- {field.description}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => insertField(field.field, "request")}
                          className="text-xs"
                        >
                          Insert
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message Template */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Message Template</CardTitle>
                <p className="text-sm text-muted-foreground">Design your message template using the available fields</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-700 dark:text-blue-300">
                    <Info className="w-4 h-4" />
                    <span>Use {`{{field_name}}`} to insert mapped fields from your Data.</span>
                  </div>
                  <Textarea
                    id="request-message"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Enter your request message..."
                    className="min-h-[120px] font-mono text-sm bg-white dark:bg-neutral-700 border-gray-200 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connection Message */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base sm:text-lg font-semibold">Connection Message</CardTitle>
                <p className="text-sm text-muted-foreground mt-1 hidden sm:block">Edit your connection message here.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  Preview
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3 block">Available fields:</Label>
                  <div className="space-y-2">
                    {availableFields.map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-neutral-700 rounded">
                        <div>
                          <code className="text-sm font-mono text-blue-600">{field.field}</code>
                          <span className="text-sm text-gray-600 dark:text-neutral-400 ml-2">- {field.description}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => insertField(field.field, "connection")}
                          className="text-xs"
                        >
                          Insert
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3 block">Message Template:</Label>
                  <Textarea
                    id="connection-message"
                    value={connectionMessage}
                    onChange={(e) => setConnectionMessage(e.target.value)}
                    placeholder="Enter your connection message..."
                    className="min-h-[120px] font-mono text-sm bg-white dark:bg-neutral-700 border-gray-200 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-base sm:text-lg font-semibold">Campaign Settings</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">Save All Changes</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900 dark:text-neutral-100">Campaign Details</h3>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-name" className="text-gray-700 dark:text-neutral-300">Campaign Name</Label>
                    <Input id="campaign-name" defaultValue="Just Herbs" className="max-w-md bg-white dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-gray-900 dark:text-neutral-100" />
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <Label htmlFor="campaign-status" className="text-gray-700 dark:text-neutral-300">Campaign Status</Label>
                    <Switch id="campaign-status" defaultChecked className="data-[state=checked]:bg-blue-600" />
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <Label htmlFor="personalization" className="text-gray-700 dark:text-neutral-300">Request without personalization</Label>
                    <Switch id="personalization" defaultChecked className="data-[state=checked]:bg-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-3 py-2">
                  <div className="space-y-1">
                    <Label htmlFor="autopilot" className="text-gray-700 dark:text-neutral-300">AutoPilot Mode</Label>
                    <p className="text-sm text-muted-foreground dark:text-neutral-400">Let the system automatically manage LinkedIn account assignments</p>
                  </div>
                  <Switch id="autopilot" className="data-[state=checked]:bg-blue-600" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-selection" className="text-gray-700 dark:text-neutral-300">Selected Accounts:</Label>
                  <Select defaultValue="1-account">
                    <SelectTrigger className="max-w-md bg-white dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-gray-900 dark:text-neutral-100">
                      <SelectValue placeholder="Select accounts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-account">1 account selected</SelectItem>
                      <SelectItem value="2-accounts">2 accounts selected</SelectItem>
                      <SelectItem value="all-accounts">All accounts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-32px.png?height=32&width=32" />
                      <AvatarFallback className="text-xs bg-orange-100 text-orange-700 font-medium">JL</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900 dark:text-neutral-100">Jivesh Lakhani</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Lead Profile Panel */}
      {selectedLead && (
        <LeadProfilePanel lead={selectedLead} isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  )
}
