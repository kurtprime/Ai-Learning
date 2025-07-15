import SideNavbarMenuGroup from "@/components/sidebar/SideNavbarMenuGroup";
import { BellIcon, FileUser } from "lucide-react";
import React from "react";

export default function UserSettingsSidebar() {
  return (
    <SideNavbarMenuGroup
      items={[
        {
          href: "/user-settings/notifications",
          icon: <BellIcon className="size-4" />,
          label: "Notifications",
        },
        {
          href: "/user-settings/resume",
          icon: <FileUser className="size-4" />,
          label: "Resume",
        },
      ]}
    />
  );
}
