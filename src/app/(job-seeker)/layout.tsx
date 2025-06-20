import AppSidebar from "@/components/sidebar/AppSidebar";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import { SignedOut } from "@/services/clerk/components/SignInStatus";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";

export default function JobSeekerLayout({ children }: { children: ReactNode }) {
  return (
    <AppSidebar
      content={
        <SidebarGroup>
          <SidebarMenu>
            <SignedOut>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/sign-in"}>
                    <LogInIcon />
                    <span>Log In</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SignedOut>
          </SidebarMenu>
        </SidebarGroup>
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
}
