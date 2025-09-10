import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CampaignDetails } from "@/components/campaign-details"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch campaign name for breadcrumb
  let campaignName = "Campaign";
  try {
    const session = await auth.api.getSession({
      headers: new Headers(),
    });
    
    if (session) {
      const campaign = await db.campaign.findFirst({
        where: {
          id: id,
          userId: session.user.id,
        },
        select: {
          name: true,
        },
      });
      
      if (campaign) {
        campaignName = campaign.name;
      }
    }
  } catch (error) {
    console.error("Error fetching campaign name:", error);
  }
  
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/campaigns">Campaign</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{campaignName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <CampaignDetails campaignId={id} />
        </div>
      </SidebarInset>
    </>
  )
}
