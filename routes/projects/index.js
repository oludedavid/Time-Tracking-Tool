const express = require("express");
const ProjectService = require("../../services/projects");
const {
  checkPermission,
  checkRole,
} = require("../../middlewares/rbacMiddleware");
const authMiddleware = require("../../middlewares/authMiddleware");
const router = express.Router();

// POST request to create a new project
router.post(
  "/projects/create",
  checkRole(["admin", "project_manager"]),
  authMiddleware,
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

router.patch(
  "projects/:projectId/assign",
  checkPermission(["projects:assign", "*"]),
  authMiddleware,
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

router.get(
  "/projects/view",
  checkPermission(["projects:view", "*"]),
  authMiddleware,
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

module.exports = router;
