import express from "express";
import WorkingHoursService from "../services/workingHoursService.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { checkPermission, checkRole } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

/**
 * @route POST api/time-entries
 * @desc Log working hours
 * @access Protected (freelancers with "hours:create" permission)
 *
 * This route allows freelancers to log their working hours. The request body
 * should contain the project ID, work entries, and hourly rate. If successful,
 * it returns the logged working hours and a success message. If an error occurs,
 * a 500 error response is returned.
 */
router.post(
  "/time-entries",
  authMiddleware,
  checkPermission(["hours:create"]),
  async (req, res) => {
    const { projectId, workEntries, hourlyRate } = req.body;
    const freelancerId = req.user.id;

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

/**
 * @route GET api/time-entries/approval-requests
 * @desc View approval requests
 * @access Protected (project managers only)
 *
 * This route allows project managers to view approval requests for working hours
 * submitted by freelancers. If successful, a list of approval requests is returned.
 * If an error occurs, a 500 error response is returned.
 */
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

/**
 * @route PATCH api/time-entries/:workingHourId/approve
 * @desc Approve or reject working hours request
 * @access Protected (project managers only)
 *
 * This route allows project managers to approve or reject a working hours request
 * submitted by freelancers. The approval status is passed as part of the request
 * body, and the working hours ID is part of the URL. If successful, the updated
 * working hours status is returned. If an error occurs (e.g., invalid status),
 * a 400 or 404 error response is returned.
 */
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

    const approvedBy = req.user.id;

    try {
      const result = await WorkingHoursService.approveOrRejectHours(
        workingHourId,
        approvalStatus,
        comments,
        approvedBy
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
