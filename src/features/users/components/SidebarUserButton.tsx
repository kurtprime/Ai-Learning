import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import SidebarUserButtonClient from "./_SidebarUserButtonClient";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { SignOutButton } from "@/services/clerk/components/AuthButtons";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOutIcon } from "lucide-react";

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
}

async function SidebarUserSuspense() {
  const { user } = await getCurrentUser({ alldata: true });
  console.log(user);
  if (!user)
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon /> <span>Log out</span>
        </SidebarMenuButton>
      </SignOutButton>
    );

  return <SidebarUserButtonClient user={user} />;
}
