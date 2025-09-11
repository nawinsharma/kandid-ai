import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { db, tables } from "@/lib/db"
import { eq } from "drizzle-orm"
import { LeadProfilePanel } from "@/components/lead-profile-panel"

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch lead name for breadcrumb
  let leadName = "Lead";
  try {
    const [lead] = await db
      .select({ name: tables.leads.name })
      .from(tables.leads)
      .where(eq(tables.leads.id, id))
      .limit(1);
    if (lead) leadName = lead.name;
  } catch {}

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-2 sm:px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/leads">Leads</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{leadName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="sm:hidden">
              <h1 className="text-lg font-semibold truncate">{leadName}</h1>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 pt-0">
          {/* Reuse profile panel inline for now. In a real page, we'd fetch full lead data and render. */}
          <div className="text-sm text-muted-foreground">Lead detail page is available via the list and campaign views. Use those to open the panel and delete.</div>
        </div>
      </SidebarInset>
    </>
  )
}


