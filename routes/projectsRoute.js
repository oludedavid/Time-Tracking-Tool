import express from "express";
import ProjectService from "../services/projectService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { checkPermission, checkRole } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

/**
 * @route POST api/projects/create
 * @desc Create a new project
 * @access Protected (Requires authentication)
 *
 * This route allows an authenticated user with appropriate roles to create a new project.
 * The user must provide the project name and description in the request body.
 *
 * Roles with access: 'admin', 'project_manager'
 */
router.post(
  "/projects/create",
  authMiddleware,
  checkRole(["admin", "project_manager"]),
  async (req, res) => {
    const { projectName, description } = req.body;

    const result = await ProjectService.createProject({
      projectName,
      description,
    });

    if (result.success) {
      res.status(201).json({
        message: "Project created successfully.",
        project: result.project,
      });
    } else {
      res
        .status(500)
        .json({ message: "Error creating project.", error: result.message });
    }
  }
);

/**
 * @route PATCH api/projects/:projectId/assign
 * @desc Assign freelancers to a project
 * @access Protected (Requires authentication)
 *
 * This route allows the assignment of one or more freelancers to a project.
 * It takes the project ID from the URL and freelancer IDs from the request body.
 *
 * Permissions required: 'projects:assign' or wildcard '*'
 */
router.patch(
  "/projects/:projectId/assign",
  authMiddleware,
  checkPermission(["projects:assign", "*"]),
  async (req, res) => {
    const { projectId } = req.params;
    const { freelancerIds } = req.body;

    const result = await ProjectService.assignFreelancersToProject(
      projectId,
      freelancerIds
    );

    if (result.success) {
      res.status(200).json({
        message: "Freelancers assigned successfully.",
        project: result.project,
      });
    } else {
      res.status(400).json({
        message: "Error assigning freelancers.",
        error: result.message,
      });
    }
  }
);

/**
 * @route GET api/projects/view
 * @desc View all projects
 * @access Protected (Requires authentication)
 *
 * This route retrieves all projects for the authenticated user.
 * The user must have the required permissions to view the projects.
 *
 * Permissions required: 'projects:view' or wildcard '*'
 */
router.get(
  "/projects/view",
  authMiddleware,
  checkPermission(["projects:view", "*"]),
  async (req, res) => {
    const result = await ProjectService.getProjects();

    if (result.success) {
      res.status(200).json({ projects: result.projects });
    } else {
      res
        .status(500)
        .json({ message: "Error fetching projects.", error: result.message });
    }
  }
);

export default router;
