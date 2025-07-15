import { AsyncIf } from "@/components/AsyncIf";
import AppSidebar from "@/components/sidebar/AppSidebar";
import SideNavbarMenuGroup from "@/components/sidebar/SideNavbarMenuGroup";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { db } from "@/drizzle/database";
import {
  JoblistingApplicationTable,
  JobListingStatus,
  JobListingTable,
} from "@/drizzle/schema";
import { getJoblistingApplicationJobListingTag } from "@/features/jobListingApplication/db/cache/jobListingApplications";
import { getJobListingOrganizationTag } from "@/features/jobListings/db/cache/jobListings";
import { sortJobListingsByStatus } from "@/features/jobListings/lib/utils";
import { SideBarOrganizationButton } from "@/features/organizations/components/SideBarOrganizationButton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasOrgUserPermissions } from "@/services/clerk/lib/orgUserPermission";
import { count, desc, eq } from "drizzle-orm";
import { ClipboardListIcon, LogInIcon, PlusIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ReactNode, Suspense } from "react";
import { JobListingMenuGroup } from "./_JobListingMenugroup";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <LayoutEmployerLayout>{children} </LayoutEmployerLayout>
    </Suspense>
  );
}

async function LayoutEmployerLayout({ children }: { children: ReactNode }) {
  const { orgId } = await getCurrentOrganization();

  if (!orgId) return redirect("/organizations/select");
  return (
    <AppSidebar
      content={
        <>
          <SidebarGroup>
            <SidebarGroupLabel>Job Listing</SidebarGroupLabel>
            <AsyncIf
              condition={() => hasOrgUserPermissions("org:job_listings:create")}
            >
              <SidebarGroupAction title="Add Job Listing" asChild>
                <Link href={"/employer/job-listings/new"}>
                  <PlusIcon /> <span className="sr-only">Add Job Listing</span>
                </Link>
              </SidebarGroupAction>
            </AsyncIf>
          </SidebarGroup>
          <SidebarContent className="group-data-[state=collapsed]:hidden">
            <Suspense>
              <JobListingMenu orgId={orgId} />
            </Suspense>
          </SidebarContent>
          <SideNavbarMenuGroup
            className="mt-auto"
            items={[
              { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },

              {
                href: "/sign-in",
                icon: <LogInIcon />,
                label: "Sign In",
                authStatus: "signedOut",
              },
            ]}
          />
        </>
      }
      footerButton={<SideBarOrganizationButton />}
    >
      {children}
    </AppSidebar>
  );
}

async function JobListingMenu({ orgId }: { orgId: string }) {
  const jobListings = await getJobListings(orgId);

  if (
    jobListings.length === 0 &&
    (await hasOrgUserPermissions("org:job_listings:create"))
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={"/employer/job-listings/new"}>
              <PlusIcon />
              <span>Create your first Job Listing</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return Object.entries(Object.groupBy(jobListings, (j) => j.status))
    .sort(([a], [b]) => {
      return sortJobListingsByStatus(
        a as JobListingStatus,
        b as JobListingStatus
      );
    })
    .map(([status, jobListings]) => (
      <JobListingMenuGroup
        key={status}
        status={status as JobListingStatus}
        jobListings={jobListings}
      />
    ));
}

async function getJobListings(orgId: string) {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));

  const data = await db
    .select({
      id: JobListingTable.id,
      title: JobListingTable.title,
      status: JobListingTable.status,
      applicationCount: count(JoblistingApplicationTable.userId),
    })
    .from(JobListingTable)
    .where(eq(JobListingTable.organizationId, orgId))
    .leftJoin(
      JoblistingApplicationTable,
      eq(JobListingTable.id, JoblistingApplicationTable.jobListingId)
    )
    .groupBy(JobListingTable.id, JoblistingApplicationTable.jobListingId)
    .orderBy(desc(JobListingTable.createdAt));

  data.forEach((jobListing) => {
    cacheTag(getJoblistingApplicationJobListingTag(jobListing.id));
  });

  return data;
}
