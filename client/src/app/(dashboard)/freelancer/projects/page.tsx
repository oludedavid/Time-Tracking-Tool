"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchData } from "@/lib/fetchData";
import { useQuery } from "@tanstack/react-query";
import secureLocalStorage from "react-secure-storage";
import { useEffect, useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TProject, TProjects } from "@/types";

type ProjectStatus = "active" | "inactive";
type ProjectGroups = Record<ProjectStatus, TProject[]>;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PROJECTS_ENDPOINT = `${API_URL}/api/projects/view`;

export default function Projects() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const storedToken = secureLocalStorage.getItem("TOKEN") as string;
    setToken(storedToken);
    return () => {
      setMounted(false);
    };
  }, []);

  const {
    data: { projects } = { projects: [] },
    error,
    isLoading,
    isError,
  } = useQuery<TProjects>({
    queryKey: ["projects"],
    queryFn: () => fetchData({ url: PROJECTS_ENDPOINT, token }),
    enabled: !!token && mounted,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const projectGroups = useMemo<ProjectGroups>(
    () => ({
      active: projects.filter((project) => project.status === "active"),
      inactive: projects.filter((project) => project.status === "inactive"),
    }),
    [projects]
  );

  if (!mounted) {
    return <ProjectSkeleton />;
  }

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  if (isError) {
    return <ErrorComponent error={error} />;
  }

  return (
    <div className="min-h-screen  py-4">
      <Tabs defaultValue="active" className="w-full p-2  rounded-lg ">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger
            value="active"
            className="text-md font-semibold text-black"
          >
            Active Projects ({projectGroups.active.length})
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="text-md font-semibold text-black"
          >
            Inactive Projects ({projectGroups.inactive.length})
          </TabsTrigger>
        </TabsList>

        {(Object.keys(projectGroups) as ProjectStatus[]).map((status) => (
          <TabsContent key={status} value={status}>
            <ProjectList status={status} projects={projectGroups[status]} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface ProjectListProps {
  projects: TProject[];
  status: ProjectStatus;
}

const ProjectList = ({ projects, status }: ProjectListProps) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-3">
    {projects.length > 0 ? (
      projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))
    ) : (
      <EmptyState status={status} />
    )}
  </div>
);

interface ProjectCardProps {
  project: TProject;
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <Card className="flex flex-col justify-between bg-gradient-to-r from-[#061161] to-[#780206] text-white rounded-md shadow-xl p-4 hover:scale-105 transition-all duration-300 ease-in-out">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">
        {project.projectName}
      </CardTitle>
      <CardDescription className="line-clamp-3">
        {project.description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm">
        <strong>Freelancers:</strong>{" "}
        {project.assignedFreelancers.length > 0
          ? project.assignedFreelancers.join(", ")
          : "None assigned"}
      </p>
    </CardContent>
    <div className="p-2 pt-0">
      <Button
        className="w-full bg-white text-[#061161] hover:bg-[#780206] hover:text-white transition-all duration-300"
        variant="outline"
        onClick={() => {}}
      >
        View Details
      </Button>
      <Button
        className="w-full mt-2 bg-white text-[#061161] hover:bg-[#780206] hover:text-white transition-all duration-300"
        variant="outline"
        onClick={() => {}}
      >
        Request
      </Button>
    </div>
  </Card>
);

const EmptyState = ({ status }: { status: ProjectStatus }) => (
  <div className="col-span-full text-center py-8 text-white">
    <p className="text-muted-foreground">
      No {status} projects.
      {status === "active" && " Create a new project to get started."}
    </p>
  </div>
);

const ProjectSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
    {Array.from({ length: 6 }, (_, i) => (
      <Card key={i} className="animate-pulse bg-gray-300 rounded-lg shadow-md">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
        <div className="p-6 pt-0">
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    ))}
  </div>
);

const ErrorComponent = ({ error }: { error: unknown }) => (
  <Alert variant="destructive" className="m-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      {error instanceof Error
        ? error.message
        : "An unexpected error occurred while loading projects"}
    </AlertDescription>
  </Alert>
);
