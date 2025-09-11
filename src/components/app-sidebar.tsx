"use client"

import type * as React from "react"
import { Users, Megaphone, MessageSquare, Settings, Home, Linkedin, FileText, ChevronDown, Headphones, Share2, LogOut, Moon, Sun } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/store"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
const overviewItems = [
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

const settingsItems = [
  {
    title: "Setting & Billing",
    url: "/settings",
    icon: Settings,
  },
]

const adminItems = [
  {
    title: "Activity logs",
    url: "/admin/activity",
    icon: FileText,
  },
  {
    title: "User logs",
    url: "/admin/users",
    icon: Users,
  },
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { user } = useAuthStore()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      // Clear auth state
      window.dispatchEvent(new CustomEvent('auth-change'))
      // Close dialog
      setShowLogoutDialog(false)
      // Redirect to home
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <>
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className={`flex items-center gap-2 px-4 py-2 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            🐦
          </div>
          {!isCollapsed && <span className="font-semibold text-lg text-blue-600">LinkBird</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Top User Profile Section */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                  PE
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium dark:text-gray-100 text-gray-900 truncate">
                  Kandid
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400  truncate">
                    Personal
                  </p>
                  <ChevronDown className="h-3 w-3 text-gray-400 dark:text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

          {/* Overview Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewItems.map((item) => {
                const isActive = pathname === item.url || (item.url === "/campaigns" && pathname.startsWith("/campaigns"))
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-50 dark:data-[active=true]:bg-blue-900/20">
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
              {settingsItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-50 dark:data-[active=true]:bg-blue-900/20">
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Panel Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-50 dark:data-[active=true]:bg-blue-900/20">
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user ? (
          <>
            {/* Action Icons */}
            {!isCollapsed && (
              <div className="px-4 py-2">
                <div className="flex items-center justify-center gap-4">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <Headphones className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button 
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Bottom User Profile Section */}
            <div className="px-4 py-3 border-t">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={(user.image as string) || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">
                      {(user.name as string) ? (user.name as string).split(' ').map(n => n[0]).join('').slice(0, 2) : (user.email as string).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -left-1 text-xs bg-blue-600 text-white px-1 py-0.5 rounded text-[10px]">
                    PRO
                  </span>
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {(user.name as string) || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email as string}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                        <button
                          onClick={() => setShowLogoutDialog(true)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <LogOut className="h-4 w-4 text-red-500 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 border-t">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-200 text-gray-600">?</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Not signed in</p>
                <p className="text-xs text-gray-500">Please log in</p>
                <button 
                  onClick={() => {
                    console.log("🔄 Manual auth refresh triggered");
                    if ((window as Window & { refreshAuth?: () => void }).refreshAuth) {
                      (window as Window & { refreshAuth?: () => void }).refreshAuth!();
                    }
                  }}
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  Refresh Auth
                </button>
              </div>
            )}
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>

    {/* Logout Confirmation Dialog */}
    <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? You will need to sign in again to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowLogoutDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
