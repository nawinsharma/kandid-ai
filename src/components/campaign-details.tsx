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
import { Users, Mail, MessageSquare, RotateCcw, ChevronDown, Info } from "lucide-react"
import { LeadProfilePanel } from "@/components/lead-profile-panel"

interface CampaignDetailsProps {
  campaignId: string
}

const campaignLeads = [
  {
    id: "1",
    name: "Sumeet Malhotra",
    title: "Don't Stop When you tired Stop when you're tired",
    company: "Just Herbs",
    campaign: "Just Herbs",
    status: "Pending",
    statusType: "pending",
    activity: 3,
    avatar: "SM",
    lastContact: null,
  },
  {
    id: "2",
    name: "Megha Sabhlok",
    title: "Co-founder, Just Herbs (acquired by Mari)",
    company: "Just Herbs",
    campaign: "Just Herbs",
    status: "Pending",
    statusType: "pending",
    activity: 3,
    avatar: "MS",
    lastContact: null,
  },
  {
    id: "3",
    name: "Archee P.",
    title: "Content and Marketing Specialist at Just Herbs",
    company: "Just Herbs",
    campaign: "Just Herbs",
    status: "Pending",
    statusType: "pending",
    activity: 3,
    avatar: "AP",
    lastContact: null,
  },
  {
    id: "4",
    name: "Hindustan Herbs",
    title: "Co-Founder at Hindustan Herbs",
    company: "Just Herbs",
    campaign: "Just Herbs",
    status: "Pending",
    statusType: "pending",
    activity: 3,
    avatar: "HH",
    lastContact: null,
  },
  {
    id: "5",
    name: "Ritika Ohri",
    title: "Brand Manager- Marketing, Talent and Innovation at Just Herbs",
    company: "Just Herbs",
    campaign: "Just Herbs",
    status: "Pending",
    statusType: "pending",
    activity: 3,
    avatar: "RO",
    lastContact: null,
  },
  {
    id: "6",
    name: "Praveen Kumar Gautam",
    title: "Vice President - Offline Sales @ Just Herbs",
    company: "Just Herbs",
    campaign: "Just Herbs",
    status: "Pending",
    statusType: "pending",
    activity: 3,
    avatar: "PG",
    lastContact: null,
  },
  {
    id: "7",
    name: "Shubham Saboo",
    title: "Associated as C&F Agent & Superstockiest at Just Herbs",
    company: "Just Herbs",
    campaign: "Just Herbs",
    status: "Pending",
    statusType: "pending",
    activity: 3,
    avatar: "SS",
    lastContact: null,
  },
  {
    id: "8",
    name: "Megha Sabhlok",
    title: "Brand Director at Just Herbs",
    company: "Just Herbs",
    campaign: "Just Herbs",
    status: "Pending",
    statusType: "pending",
    activity: 3,
    avatar: "MS",
    lastContact: null,
  },
]

export function CampaignDetails({ campaignId }: CampaignDetailsProps) {
  // campaignId is available for future use
  console.log("Campaign ID:", campaignId);
  const [selectedLead, setSelectedLead] = useState<(typeof campaignLeads)[0] | null>(null)
  const [requestMessage, setRequestMessage] = useState(
    "Hi {{firstName}}, I'm building consultative AI salespersons for personal care brands with the guarantee to boost your b2c revenue by min of 2%. Would love to connect if you're open to exploring this for Just Herbs!",
  )
  const [connectionMessage, setConnectionMessage] = useState(
    "Awesome to connect, {{firstName}}! Allow me to explain Kandid a bit: So these are consultative salespersons that engage with visitors like an offline store salesperson does. It helps them with product recommendations based on their preferences/concerns. Here's a video to help you visualise it better: https://youtu.be/331XRg-vPo",
  )

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Details</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your campaign performance</p>
        </div>
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
          Active
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-gray-300 bg-white"></div>
            Overview
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="sequence" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Sequence
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-gray-300 bg-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            </div>
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Request Sent</CardTitle>
                <Mail className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Request Accepted</CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Request Replied</CardTitle>
                <RotateCcw className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Campaign Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Campaign Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Leads Contacted</span>
                    <span>0.0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Acceptance Rate</span>
                    <span>0.0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reply Rate</span>
                    <span>0.0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Campaign Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Start Date:</span>
                  <span className="text-sm font-medium">02/09/2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Conversion Rate:</span>
                  <span className="text-sm font-medium">0.0%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2">
                          Name
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Lead Description</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Activity</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2">
                          Status
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {campaignLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={`/placeholder-32px.png?height=40&width=40`} />
                              <AvatarFallback className="text-sm bg-gray-100 text-gray-600 font-medium">
                                {lead.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">{lead.title}</span>
                        </td>
                        <td className="py-4 px-6">{renderActivityBars(lead.activity)}</td>
                        <td className="py-4 px-6">
                          <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                            Pending
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequence" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Request Message */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Request Message</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Edit your request message here.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Save
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Available fields:</Label>
                  <div className="space-y-2">
                    {availableFields.map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <code className="text-sm font-mono text-blue-600">{field.field}</code>
                          <span className="text-sm text-gray-600 ml-2">- {field.description}</span>
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
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                    <Info className="w-4 h-4" />
                    <span>Use {`{{field_name}}`} to insert mapped fields from your Data.</span>
                  </div>
                  <Textarea
                    id="request-message"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Enter your request message..."
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connection Message */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Connection Message</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Edit your connection message here.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Save
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Available fields:</Label>
                  <div className="space-y-2">
                    {availableFields.map((field, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <code className="text-sm font-mono text-blue-600">{field.field}</code>
                          <span className="text-sm text-gray-600 ml-2">- {field.description}</span>
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
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Message Template:</Label>
                  <Textarea
                    id="connection-message"
                    value={connectionMessage}
                    onChange={(e) => setConnectionMessage(e.target.value)}
                    placeholder="Enter your connection message..."
                    className="min-h-[120px] font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Campaign Settings</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save All Changes</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">Campaign Details</h3>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" defaultValue="Just Herbs" className="max-w-md" />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-1">
                      <Label htmlFor="campaign-status">Campaign Status</Label>
                      <p className="text-sm text-muted-foreground">Enable or disable this campaign</p>
                    </div>
                    <Switch id="campaign-status" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-1">
                      <Label htmlFor="personalization">Request without personalization</Label>
                      <p className="text-sm text-muted-foreground">Send requests without personalized messages</p>
                    </div>
                    <Switch id="personalization" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">AutoPilot Mode</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Let the system automatically manage LinkedIn account assignments
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <Label htmlFor="autopilot">Enable AutoPilot</Label>
                    <p className="text-sm text-muted-foreground">Automatically assign leads to available accounts</p>
                  </div>
                  <Switch id="autopilot" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-selection">Selected Accounts:</Label>
                  <Select defaultValue="1-account">
                    <SelectTrigger className="max-w-md">
                      <SelectValue placeholder="Select accounts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-account">1 account selected</SelectItem>
                      <SelectItem value="2-accounts">2 accounts selected</SelectItem>
                      <SelectItem value="all-accounts">All accounts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-32px.png?height=32&width=32" />
                      <AvatarFallback className="text-xs bg-orange-100 text-orange-700 font-medium">JL</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900">Jivesh Lakhani</span>
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
