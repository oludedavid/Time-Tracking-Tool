"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "../ui/sidebar";
import LogoutButton from "./logout";
import Link from "next/link";
import Brand from "./brand";
import { usePathname } from "next/navigation";
import { TmenuItems } from "@/types";

export default function DashboardSideBar({
  menuItems,
}: {
  menuItems: TmenuItems;
}) {
  const pathName = usePathname();

  return (
    <Sidebar className="sidebar">
      <SidebarHeader className="sideBarHeader flex items-center gap-2 ">
        <Brand className="font-bold text-2xl py-2" brandText="Logify" />
      </SidebarHeader>
      <SidebarContent
        style={{
          backgroundColor:
            "linear-gradient(195deg, #061161EE 0%, #780206DD 100%)",
        }}
        className="sideBarContent py-4"
      >
        <ul className="space-y-6">
          {menuItems.map((menuItem, index) => {
            const isActive = pathName === menuItem.url;
            const Icon = menuItem.icon;

            return (
              <li className="sideBarItems" key={index}>
                <Link
                  className={`p-3 flex items-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground bg-red-50 text-[#FF4500]"
                      : "hover:bg-white hover:text-black"
                  }`}
                  href={menuItem.url}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {menuItem.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </SidebarContent>
      <SidebarFooter className="border-t pt-4">
        <LogoutButton className="w-full justify-start pl-3" />
      </SidebarFooter>
    </Sidebar>
  );
}
