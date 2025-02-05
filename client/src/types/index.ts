export type TmenuItem = {
  url: string;
  name: string;
  icon: React.ElementType;
};

export type TUser = {
  id: string;
  name: string;
  role: string;
};

export type TFetchDataParam = {
  url: string;
  token?: string;
  headers?: Record<string, string>;
};

export type TProject = {
  _id: string;
  projectName: string;
  description: string;
  assignedFreelancers: string[];
  status: "active" | "inactive";
};

export type TProjects = {
  projects: TProject[];
};

export type TmenuItems = TmenuItem[];
