import { Suspense } from "react";
import SidebarUserButtonClient from "./_SidebarOrganizationButtonClient";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth";
import { SignOutButton } from "@/services/clerk/components/AuthButtons";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import SidebarOrganizationButtonClient from "./_SidebarOrganizationButtonClient";

export function SideBarOrganizationButton() {
  return (
    <Suspense>
      <SideBarOrganizationSuspense />
    </Suspense>
  );
}

async function SideBarOrganizationSuspense() {
  const [{ user }, { organization }] = await Promise.all([
    getCurrentUser({ alldata: true }),
    getCurrentOrganization({ alldata: true }),
  ]);

  if (!user || !organization)
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon /> <span>Log out</span>
        </SidebarMenuButton>
      </SignOutButton>
    );

  return (
    <SidebarOrganizationButtonClient user={user} organization={organization} />
  );
}
