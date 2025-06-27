import AppSidebar from "@/components/sidebar/AppSidebar";
import SideNavbarMenuGroup from "@/components/sidebar/SideNavbarMenuGroup";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import { SignedOut } from "@/services/clerk/components/SignInStatus";
import {
  BrainCircuitIcon,
  ClipboardList,
  ClipboardListIcon,
  LayoutDashboardIcon,
  LogInIcon,
} from "lucide-react";
import React, { ReactNode } from "react";

export default function JobSeekerLayout({ children }: { children: ReactNode }) {
  return (
    <AppSidebar
      content={
        <SideNavbarMenuGroup
          className="mt-auto"
          items={[
            { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
            {
              href: "/ai-search",
              icon: <BrainCircuitIcon />,
              label: "Ai Search",
            },
            {
              href: "/employer",
              icon: <LayoutDashboardIcon />,
              label: "Employer Dashboard",
              authStatus: "signedIn",
            },
            {
              href: "/sign-in",
              icon: <LogInIcon />,
              label: "Sign In",
              authStatus: "signedOut",
            },
          ]}
        />
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
}
