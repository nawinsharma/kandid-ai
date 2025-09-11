"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { X, ChevronDown, CheckCircle, Clock, MessageSquare, Trash2, ExternalLink } from "lucide-react"
import { useDeleteLead } from "@/hooks/use-leads"
import { useToast } from "@/hooks/use-toast"

interface Lead {
  id: string
  name: string
  title: string
  company: string
  campaign: string
  status: string
  statusType: string
  activity: number
  avatar: string
  lastContact: string | null
}

interface LeadProfilePanelProps {
  lead: Lead
  isOpen: boolean
  onClose: () => void
}

export function LeadProfilePanel({ lead, isOpen, onClose }: LeadProfilePanelProps) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  const deleteLead = useDeleteLead()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await deleteLead.mutateAsync(lead.id)
      toast({ title: "Lead deleted" })
      onClose()
    } catch {
      toast({ title: "Failed to delete lead", variant: "destructive" })
    }
  }

  const timelineItems = [
    {
      type: "invitation",
      title: "Invitation Request",
      message:
        "Hi Dilbag, I'm building consultative AI salespersons for personal care brands with the guarantee to boost your b2c revenue by min of 2%. Would love to connect if you're open to exploring this for Just Herbs!",
      status: "completed",
      time: "Sent 7 mins ago",
      icon: CheckCircle,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      type: "connection",
      title: "Connection Status",
      message: "Check connection status",
      status: "pending",
      time: null,
      icon: Clock,
      iconColor: "text-gray-400",
      bgColor: "bg-gray-100",
    },
    {
      type: "acceptance",
      title: "Connection Acceptance Message",
      message:
        "Awesome to connect, Dilbag! Allow me to explain Kandid a bit: So these are consultative salespersons that engage with visitors like an offline store salesperson does. It helps them with product recommendations based on their preferences/concerns. Here's a video to help you visualise it better: https://youtu.be/331XRg-vPo",
      status: "pending",
      time: null,
      icon: MessageSquare,
      iconColor: "text-gray-400",
      bgColor: "bg-gray-100",
      hasMore: true,
    },
    {
      type: "followup1",
      title: "Follow-up 1",
      message: "Hey, did you get a chance to go through the video I shared earlier?",
      status: "pending",
      time: null,
      icon: MessageSquare,
      iconColor: "text-gray-400",
      bgColor: "bg-gray-100",
      hasMore: true,
    },
    {
      type: "followup2",
      title: "Follow-up 2",
      message: "Hi Dilbag, just following up on my message about consultative AI for Just Herbs.",
      status: "pending",
      time: null,
      icon: MessageSquare,
      iconColor: "text-gray-400",
      bgColor: "bg-gray-100",
      hasMore: true,
    },
    {
      type: "replied",
      title: "Replied",
      message: "No reply",
      status: "no-reply",
      time: null,
      icon: X,
      iconColor: "text-gray-400",
      bgColor: "bg-gray-100",
      hasReply: false,
    },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[400px] md:w-[540px] p-0 overflow-y-auto bg-white dark:bg-neutral-800">
        <SheetHeader className="p-4 sm:p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base sm:text-lg font-semibold">Lead Profile</SheetTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleDelete} disabled={deleteLead.isPending}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="p-4 sm:p-6">
          {/* Lead Header */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
              <AvatarImage src={(lead as { profileImage?: string }).profileImage || "/placeholder-32px.png?height=64&width=64"} />
              <AvatarFallback className="text-sm sm:text-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-medium">{lead.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">{lead.name}</h3>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 flex-shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 truncate">{lead.title}</p>
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                <span className="truncate">at {lead.company}, Author: रोग और मर्द</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="w-2 h-2 bg-neutral-300 dark:bg-neutral-600 rounded-full"></span>
                  <span className="truncate">{lead.company}</span>
                </div>
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                  Sent 7 mins ago
                </Badge>
              </div>
            </div>
          </div>

          {/* Additional Profile Info */}
          <div className="mb-4 sm:mb-6">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto text-sm text-neutral-600 dark:text-neutral-400 hover:bg-transparent"
              onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
            >
              Additional Profile Info
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdditionalInfo ? "rotate-180" : ""}`} />
            </Button>
            {showAdditionalInfo && (
              <div className="mt-3 p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <p>
                    <span className="font-medium">Location:</span> India
                  </p>
                  <p>
                    <span className="font-medium">Industry:</span> Health & Wellness
                  </p>
                  <p>
                    <span className="font-medium">Company Size:</span> 51-200 employees
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator className="mb-4 sm:mb-6" />

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-2 sm:left-3 top-6 bottom-0 w-px bg-gray-200"></div>

            <div className="space-y-4 sm:space-y-6">
              {timelineItems.map((item, index) => (
                <div key={index} className="relative flex items-start gap-3 sm:gap-4">
                  <div
                    className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full ${item.bgColor} flex items-center justify-center relative z-10`}
                  >
                    <item.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.title}</h4>
                      {item.time && <span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0 ml-2">{item.time}</span>}
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-2 sm:p-3 mb-2">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {item.message.length > 100 && !item.hasMore
                          ? `${item.message.substring(0, 100)}...`
                          : item.message}
                      </p>
                    </div>
                    {item.hasMore && (
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 text-xs">
                        See More
                      </Button>
                    )}
                    {item.type === "replied" && item.hasReply === false && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">No reply</span>
                        <Button variant="outline" size="sm" className="text-xs h-6 bg-transparent">
                          View Reply
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
