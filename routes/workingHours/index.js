const express = require("express");
const WorkingHoursService = require("../../services/workingHours");
const authMiddleware = require("../../middlewares/authMiddleware");
const {
  checkPermission,
  checkRole,
} = require("../../middlewares/rbacMiddleware");
const router = express.Router();

// POST request to log working hours
// Only authenticated freelancers with "hours:create" permission can log hours
router.post(
  "/hours",
  authMiddleware,
  checkPermission("hours:create"),
  async (req, res) => {
    const { freelancerId, projectId, workEntries, hourlyRate } = req.body;

    const result = await WorkingHoursService.logWorkingHours(
      freelancerId,
      projectId,
      workEntries,
      hourlyRate
    );

    if (result.success) {
      res.status(201).json({
        message: "Working hours logged successfully.",
        workingHours: result.workingHours,
      });
    } else {
      res.status(500).json({
        message: "Error logging working hours.",
        error: result.message,
      });
    }
  }
);

// GET request to view approval requests
// Only authenticated project managers can view approval requests
router.get(
  "/hours/approval-requests",
  authMiddleware,
  checkRole(["project_manager"]),
  async (req, res) => {
    const result = await WorkingHoursService.getApprovalRequests();

    if (result.success) {
      res.status(200).json({ approvalRequests: result.approvalRequests });
    } else {
      res.status(500).json({
        message: "Error fetching approval requests.",
        error: result.message,
      });
    }
  }
);

// PATCH request to approve or reject a working hours request
// Only authenticated project managers can approve or reject working hours
router.patch(
  "/hours/:id/approve",
  authMiddleware,
  checkRole(["project_manager"]),
  async (req, res) => {
    const { id } = req.params;
    const { approvalStatus, comments } = req.body;

    const result = await WorkingHoursService.approveOrRejectHours(
      id,
      approvalStatus,
      comments,
      req.user.id // The authenticated user's ID
    );

    if (result.success) {
      res.status(200).json({
        message: result.message,
        updatedWorkingHours: result.updatedWorkingHours,
      });
    } else {
      res.status(500).json({
        message: "Error updating approval status.",
        error: result.message,
      });
    }
  }
);

module.exports = router;
