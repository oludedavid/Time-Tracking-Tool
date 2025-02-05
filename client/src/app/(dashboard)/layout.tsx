"use client";

import { useState, useEffect } from "react";
import { TmenuItems } from "@/types";
import { TUser } from "@/types";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSideBar from "@/components/custom/dashboardSidebar";
import NavBar from "@/components/custom/nav-bar";
import secureLocalStorage from "react-secure-storage";

import {
  Clock,
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
} from "lucide-react";

export const freelancerMenuItems: TmenuItems = [
  { url: "/freelancer", name: "Dashboard", icon: LayoutDashboard },
  { url: "/freelancer/projects", name: "My Projects", icon: Briefcase },
  { url: "/freelancer/log-work", name: "Log Work", icon: FileText },
  { url: "/freelancer/time-entries", name: "Time Entry", icon: Clock },
  { url: "/freelancer/messages", name: "Messages", icon: MessageSquare },
  { url: "/freelancer/dashboard-settings", name: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<TUser>({ id: "", name: "", role: "" });

  useEffect(() => {
    const userData = secureLocalStorage.getItem("USER");
    if (userData) {
      setUser(JSON.parse(userData as string));
    }
  }, []);

  return (
    <SidebarProvider suppressContentEditableWarning>
      <DashboardSideBar menuItems={freelancerMenuItems} />
      <SidebarTrigger className="py-6" />
      <main className="w-full">
        <NavBar user={user} />
        <>{children}</>
      </main>
    </SidebarProvider>
  );
}
