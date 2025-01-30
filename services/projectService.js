import ProjectModel from "../models/ProjectModel.js";
import UserModel from "../models/UserModel.js";

class ProjectService {
  /**
   * Creates a new project in the database.
   * @param {Object} projectData - The data for the new project.
   * @param {String} projectData.projectName - The name of the project.
   * @param {String} projectData.description - A brief description of the project.
   * @returns {Object} - An object containing success status and the created project or an error message.
   */
  static async createProject(projectData) {
    const { projectName, description } = projectData;

    // Create a new project instance using the provided data
    const project = new ProjectModel({
      projectName,
      description,
    });

    try {
      // Save the project to the database
      const savedProject = await project.save();
      return { success: true, project: savedProject };
    } catch (error) {
      // Handle and return any errors that occur during the save process
      return { success: false, message: error.message };
    }
  }

  /**
   * Assigns freelancers to a specific project.
   * @param {String} projectId - The ID of the project to which freelancers will be assigned.
   * @param {String[]} freelancerIds - An array of IDs representing the freelancers to assign.
   * @returns {Object} - An object containing success status and the updated project or an error message.
   */
  static async assignFreelancersToProject(projectId, freelancerIds) {
    if (!Array.isArray(freelancerIds)) {
      return { success: false, message: "freelancerIds must be an array" };
    }

    try {
      const project = await ProjectModel.findById(projectId);

      if (!project) {
        return { success: false, message: "Project not found" };
      }

      const freelancers = await UserModel.find({
        _id: { $in: freelancerIds },
        roleName: "freelancer",
      });

      if (freelancers.length !== freelancerIds.length) {
        return {
          success: false,
          message: "One or more freelancer IDs are invalid or not freelancers.",
        };
      }

      project.assignedFreelancers.push(...freelancers.map((f) => f._id));
      await project.save();

      return { success: true, project };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Retrieves all projects along with their assigned freelancers.
   * @returns {Object} - An object containing success status and an array of projects or an error message.
   */
  static async getProjects() {
    try {
      // Retrieve all projects and populate the assignedFreelancers field with freelancer details
      const projects = await ProjectModel.find().populate(
        "assignedFreelancers",
        "fullName email"
      );
      return { success: true, projects };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default ProjectService;
