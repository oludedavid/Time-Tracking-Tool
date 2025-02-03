"use client";

import RouteGuard from "@/components/custom/routeGuard";
import { FC } from "react";

const ProjectmanagerDashboardContent: FC = () => {
  return (
    <div className="">
      <h1>Project manager dashboard Page</h1>
    </div>
  );
};

const ProjectmanagerDashboard = RouteGuard(
  ProjectmanagerDashboardContent,
  ["project_manager"],
  {
    strictRoleCheck: true,
  }
);

export default ProjectmanagerDashboard;
