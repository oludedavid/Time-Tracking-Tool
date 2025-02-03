"use client";

import RouteGuard from "@/components/custom/routeGuard";
import { FC } from "react";

const AdminDashboardContent: FC = () => {
  return (
    <div className="">
      <h1>Admin Page</h1>
    </div>
  );
};

const AdminDashboard = RouteGuard(AdminDashboardContent, ["admin"], {
  strictRoleCheck: true,
});

export default AdminDashboard;
