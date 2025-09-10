"use client"

import type * as React from "react"
import { Users, Megaphone, MessageSquare, Settings, Home, Linkedin, FileText } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/store"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

// Navigation items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Users,
  },
  {
    title: "Campaign",
    url: "/campaigns",
    icon: Megaphone,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    badge: "10+",
  },
  {
    title: "LinkedIn Accounts",
    url: "/linkedin-accounts",
    icon: Linkedin,
  },
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { user } = useAuthStore()
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className={`flex items-center gap-2 px-4 py-2 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            L
          </div>
          {!isCollapsed && <span className="font-semibold text-lg text-gray-900 dark:text-neutral-100">LinkBird</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Overview Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || (item.url === "/campaigns" && pathname.startsWith("/campaigns"))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && !isCollapsed && (
                          <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Setting & Billing" isActive={pathname === "/settings"}>
                  <a href="/settings" className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    <span>Setting & Billing</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Panel Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Activity logs" isActive={pathname === "/admin/activity"}>
                  <a href="/admin/activity" className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <span>Activity logs</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="User logs" isActive={pathname === "/admin/users"}>
                  <a href="/admin/users" className="flex items-center gap-3">
                    <Users className="h-4 w-4" />
                    <span>User logs</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3 border-t">
              <Avatar className="h-8 w-8">
                <AvatarImage src={(user.image as string) || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {(user.name as string) ? (user.name as string).charAt(0).toUpperCase() : (user.email as string).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">
                    {(user.name as string) || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                    {user.email as string}
                  </p>
                </div>
              )}
              <ThemeToggle />
            </div>
            {!isCollapsed && (
              <div className="px-4 pb-3">
                <LogoutButton />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 border-t">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300">?</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">Not signed in</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">Please log in</p>
                <button 
                  onClick={() => {
                    console.log("🔄 Manual auth refresh triggered");
                    if ((window as Window & { refreshAuth?: () => void }).refreshAuth) {
                      (window as Window & { refreshAuth?: () => void }).refreshAuth!();
                    }
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                >
                  Refresh Auth
                </button>
              </div>
            )}
            <ThemeToggle />
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
