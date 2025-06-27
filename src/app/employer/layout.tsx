import AppSidebar from "@/components/sidebar/AppSidebar";
import SideNavbarMenuGroup from "@/components/sidebar/SideNavbarMenuGroup";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { SideBarOrganizationButton } from "@/features/organizations/components/SideBarOrganizationButton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { ClipboardListIcon, LogInIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ReactNode, Suspense } from "react";

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
            <SidebarGroupAction title="Add Job Listing" asChild>
              <Link href={"/employer/job-listings/new"}>
                <PlusIcon /> <span className="sr-only">Add Job Listing</span>
              </Link>
            </SidebarGroupAction>
          </SidebarGroup>
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
