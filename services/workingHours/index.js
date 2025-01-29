const WorkingHoursModel = require("../models/workingHours");

class WorkingHoursService {
  /**
   * Logs working hours for a freelancer on a specific project.
   * @param {String} freelancerId - The ID of the freelancer.
   * @param {String} projectId - The ID of the project.
   * @param {Array<Object>} workEntries - An array of work entries, each containing hours worked.
   * @param {Number} hourlyRate - The hourly rate of the freelancer.
   * @returns {Object} - An object containing a success flag and the saved working hours or an error message.
   */
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

  /**
   * Retrieves all approval requests with a pending status.
   * @returns {Object} - An object containing a success flag and the list of approval requests or an error message.
   */
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

  /**
   * Approves or rejects a working hours entry.
   * @param {String} approvalStatus - The approval status, either 'approved' or 'rejected'.
   * @param {String} comments - Comments regarding the approval or rejection.
   * @param {String} userId - The ID of the user performing the action.
   * @returns {Object} - An object containing a success flag, a message, and the updated working hours entry or an error message.
   */
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
