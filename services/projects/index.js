const ProjectModel = require("../../models/ProjectModel");
const UserModel = require("../../models/UserModel");

class ProjectService {
  static async createProject(projectData) {
    const { projectName, description } = projectData;

    const project = new ProjectModel({
      projectName,
      description,
    });

    try {
      const savedProject = await project.save();
      return { success: true, project: savedProject };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async assignFreelancersToProject(projectId, freelancerIds) {
    try {
      const project = await ProjectModel.findById(projectId);

      if (!project) {
        return { success: false, message: "Project not found" };
      }

      const freelancers = await UserModel.find({
        _id: { $in: freelancerIds },
        role: "freelancer",
      });

      if (freelancers.length !== freelancerIds.length) {
        return {
          success: false,
          message: "One or more freelancer IDs are invalid or not freelancers.",
        };
      }

      project.assignedFreelancers.push(...freelancerIds);
      const updatedProject = await project.save();

      return { success: true, project: updatedProject };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async getProjects() {
    try {
      const projects = await ProjectModel.find().populate(
        "assignedFreelancers",
        "name email"
      );
      return { success: true, projects };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = ProjectService;
