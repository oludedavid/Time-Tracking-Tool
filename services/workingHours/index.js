const WorkingHoursModel = require("../models/workingHours");

class WorkingHoursService {
  static async logWorkingHours(
    freelancerId,
    projectId,
    workEntries,
    hourlyRate
  ) {
    const totalHours = workEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalAmount = totalHours * hourlyRate;

    const workingHours = new WorkingHoursModel({
      freelancerId,
      projectId,
      workEntries,
      hourlyRate,
      totalHours,
      totalAmount,
      approvalStatus: "pending",
    });

    try {
      const savedWorkingHours = await workingHours.save();
      return { success: true, workingHours: savedWorkingHours };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Method to fetch all approval requests (pending status)
  static async getApprovalRequests() {
    try {
      const approvalRequests = await WorkingHoursModel.find({
        approvalStatus: "pending",
      });
      return { success: true, approvalRequests };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async approveOrRejectHours(approvalStatus, comments, userId) {
    if (!["approved", "rejected"].includes(approvalStatus)) {
      return {
        success: false,
        message:
          "Invalid approval status. It should be 'approved' or 'rejected'.",
      };
    }

    try {
      const updatedWorkingHours = await WorkingHoursModel.findByIdAndUpdate(
        { approvalStatus, comments, approvedBy: userId },
        { new: true }
      );

      if (!updatedWorkingHours) {
        return { success: false, message: "Working hours entry not found." };
      }

      return {
        success: true,
        message: `Working hours ${approvalStatus} successfully.`,
        updatedWorkingHours,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = WorkingHoursService;
