const UserService = require("../../services/user");
const express = require("express");
const router = express.Router();
const userService = new UserService();
const authMiddleware = require("../../middlewares/authMiddleware");
const {
  checkPermission,
  checkRole,
} = require("../../middlewares/rbacMiddleware");

router.post("/users/register", async (req, res) => {
  try {
    await userService.createUser(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An unexpected error occurred.", error: error.message });
  }
});

router.post("/users/login", userService.login);

router.patch(
  "/users/:userId/assign-role",
  authMiddleware,
  checkRole(["admin", "project_manager"]),
  async (req, res) => {
    const { userId } = req.params;
    const { roleName } = req.body;

    try {
      const updatedUser = await userService.assignRoleToUser(userId, roleName);
      res.status(200).json({
        message: "Role assigned successfully.",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error assigning role.",
        error: error.message,
      });
    }
  }
);

router.patch(
  "/users/:userId/update",
  authMiddleware,
  checkPermission(["users:update_own", "users:update", "*"]),
  async (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;
    try {
      const updatedUser = await userService.updateUser(userId, updateData);
      res.status(200).json({
        message: "User updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating user.",
        error: error.message,
      });
    }
  }
);

router.delete(
  "users/:userId",
  authMiddleware,
  checkRole(["admin", "project_manager"]),
  async (req, res) => {
    const { userId } = req.params;
    try {
      const deletedUser = await userService.deleteUser(userId);
      res.status(200).json({
        message: "User deleted successfully.",
        user: deletedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting user.",
        error: error.message,
      });
    }
  }
);

module.exports = router;
