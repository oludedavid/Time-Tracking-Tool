import express from "express";
import WorkingHoursService from "../services/workingHoursService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { checkPermission, checkRole } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

// POST request to log working hours
// Only authenticated freelancers with "hours:create" permission can log hours
router.post(
  "/time-entries",
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
  "/time-entries/approval-requests",
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
  "/time-entries/:workingHourId/approve",
  authMiddleware,
  checkRole(["project_manager"]),
  async (req, res) => {
    const { workingHourId } = req.params;
    const { approvalStatus, comments } = req.body;

    // Validate input
    if (!approvalStatus || !["approved", "rejected"].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status. Must be 'approved' or 'rejected'.",
      });
    }

    try {
      const result = await WorkingHoursService.approveOrRejectHours(
        workingHourId,
        approvalStatus,
        comments,
        req.user.id
      );

      if (!result.success) {
        return res
          .status(result.message.includes("not found") ? 404 : 400)
          .json({
            success: false,
            message: result.message,
          });
      }

      res.status(200).json({
        success: true,
        message: result.message,
        updatedWorkingHours: result.updatedWorkingHours,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);

export default router;
