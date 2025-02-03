"use client";
import LogoutButton from "@/components/custom/logout";
import RouteGuard from "@/components/custom/routeGuard";
import { FC } from "react";

const FreelancerDashboardContent: FC = () => {
  return (
    <div className="">
      <h1>Freelancer dashboard Page</h1>
      <LogoutButton />
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
