"use client";

import RouteGuard from "@/components/custom/routeGuard";
import { FC } from "react";

const FreelancerDashboardContent: FC = () => {
  return (
    <div className="p-4">
      <h1 className="font-extrabold text-3xl">Overview</h1>
    </div>
  );
};

const FreelancerDashboard = RouteGuard(
  FreelancerDashboardContent,
  ["freelancer"],
  {
    strictRoleCheck: true,
  }
);

export default FreelancerDashboard;
