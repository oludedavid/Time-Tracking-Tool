import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { checkPermission, checkRole } from "../middlewares/rbacMiddleware.js";
import UserService from "../services/userService.js";

const router = express.Router();

router.post("/users/register", UserService.createUser);
router.post("/users/login", UserService.login);

router.patch(
  "/users/:userId/assign-role",
  authMiddleware,
  checkRole(["admin", "project_manager"]),
  async (req, res) => {
    const { userId } = req.params;
    const { roleName } = req.body;

    try {
      const updatedUser = await UserService.assignRoleToUser(userId, roleName);
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
      const updatedUser = await UserService.updateUser(userId, updateData);
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
  "/users/:userId",
  authMiddleware,
  checkRole(["admin", "project_manager"]),
  async (req, res) => {
    const { userId } = req.params;
    try {
      const deletedUser = await UserService.deleteUser(userId);
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

export default router;
