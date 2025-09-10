"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, CheckCircle, Clock, User, Ban, Send } from "lucide-react"

const campaigns = [
  { name: "Just Herbs", status: "Active" },
  { name: "Juicy chemistry", status: "Active" },
  { name: "Hyugalife 2", status: "Active" },
  { name: "Honeyveda", status: "Active" },
  { name: "HempStreet", status: "Active" },
  { name: "HealthyHey 2", status: "Active" },
]

const linkedinAccounts = [
  {
    name: "Pulkit Garg",
    email: "1999pulkitgarg@gmail.com",
    status: "Connected",
    requests: "17/30",
    progress: 57,
    avatar: "PG",
  },
  {
    name: "Jivesh Lakhani",
    email: "jivesh@gmail.com",
    status: "Connected",
    requests: "19/30",
    progress: 63,
    avatar: "JL",
  },
  {
    name: "Indrajit Sahani",
    email: "indrajit38mp@gmail.com",
    status: "Connected",
    requests: "18/30",
    progress: 60,
    avatar: "IS",
  },
  {
    name: "Bhavya Arora",
    email: "bhavyaarora199.ba@gmail.c...",
    status: "Connected",
    requests: "18/100",
    progress: 18,
    avatar: "BA",
  },
]

const recentActivity = [
  {
    name: "Om Satyarthy",
    title: "Regional Head",
    campaign: "Gynoveda",
    status: "Pending Approval",
    statusType: "pending",
    time: null,
    avatar: "OS",
  },
  {
    name: "Dr. Bhuvaneshwari",
    title: "Fertility & Women's Health ♀ A...",
    campaign: "Gynoveda",
    status: "Sent 7 mins ago",
    statusType: "sent",
    time: "7 mins ago",
    avatar: "DB",
  },
  {
    name: "Surdeep Singh",
    title: "Building Product-led SEO Growt...",
    campaign: "Gynoveda",
    status: "Sent 7 mins ago",
    statusType: "sent",
    time: "7 mins ago",
    avatar: "SS",
  },
  {
    name: "Dilbag Singh",
    title: "Manager Marketing & Communicat...",
    campaign: "Gynoveda",
    status: "Sent 7 mins ago",
    statusType: "sent",
    time: "7 mins ago",
    avatar: "DS",
  },
  {
    name: "Vanshy Jain",
    title: "Ayurveda||primary infertility||...",
    campaign: "Gynoveda",
    status: "Sent 7 mins ago",
    statusType: "sent",
    time: "7 mins ago",
    avatar: "VJ",
  },
  {
    name: "Sunil Pal",
    title: "Helping Fashion & Lifestyle Br...",
    campaign: "Digi Sidekick",
    status: "Pending Approval",
    statusType: "pending",
    time: null,
    avatar: "SP",
  },
  {
    name: "Utkarsh K.",
    title: "Airbnb Host | Ex-The Skin Stor...",
    campaign: "The skin story",
    status: "Do Not Contact",
    statusType: "blocked",
    time: null,
    avatar: "UK",
  },
  {
    name: "Shreya Ramakrishna",
    title: "Deputy Manager - Founder's Off...",
    campaign: "Pokonut",
    status: "Followup 10 mins ago",
    statusType: "followup",
    time: "10 mins ago",
    avatar: "SR",
  },
  {
    name: "Deepak Kumar",
    title: "Deputy manager Advertising and...",
    campaign: "Re'equil",
    status: "Followup 10 mins ago",
    statusType: "followup",
    time: "10 mins ago",
    avatar: "DK",
  },
]

export function Dashboard() {
  return (
    <div className="flex-1 space-y-8 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Campaigns and LinkedIn Accounts stacked vertically */}
        <div className="space-y-6">
          {/* Campaigns Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Campaigns</h2>
              <Button variant="outline" size="sm" className="text-sm">
                All Campaigns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="divide-y divide-gray-100">
                {campaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{campaign.name}</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium px-2 py-1">
                      {campaign.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LinkedIn Accounts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">LinkedIn Accounts</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-3 border-b border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <div>Account</div>
                  <div>Status</div>
                  <div>Requests</div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {linkedinAccounts.map((account, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
                        <AvatarFallback className="text-sm bg-orange-100 text-orange-700 font-medium">
                          {account.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1">
                          <p className="text-sm font-medium text-gray-900">{account.name}</p>
                          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">in</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{account.email}</p>
                      </div>
                    </div>
                    <div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium px-2 py-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {account.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">{account.requests}</span>
                      </div>
                      <Progress value={account.progress} className="h-2 bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section - Takes full right side */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Button variant="outline" size="sm" className="text-sm">
              Most Recent <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-3 border-b border-gray-100">
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div>Lead</div>
                <div>Campaign</div>
                <div>Status</div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivity.slice(0, 8).map((activity, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} />
                      <AvatarFallback className="text-xs bg-gray-100 text-gray-600 font-medium">
                        {activity.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.name}</p>
                      <p className="text-xs text-gray-500 truncate">{activity.title}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{activity.campaign}</div>
                  <div>
                    {activity.statusType === "pending" && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs font-medium px-2 py-1">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Approval
                      </Badge>
                    )}
                    {activity.statusType === "sent" && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs font-medium px-2 py-1">
                        <User className="w-3 h-3 mr-1" />
                        Sent 7 mins ago
                      </Badge>
                    )}
                    {activity.statusType === "blocked" && (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs font-medium px-2 py-1">
                        <Ban className="w-3 h-3 mr-1" />
                        Do Not Contact
                      </Badge>
                    )}
                    {activity.statusType === "followup" && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium px-2 py-1">
                        <Send className="w-3 h-3 mr-1" />
                        Followup 10 mins ago
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
