import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { checkPermission, checkRole } from "../middlewares/rbacMiddleware.js";
import UserService from "../services/userService.js";

const router = express.Router();

/**
 * @route POST api/users/register
 * @desc Register a new user
 * @access Public
 *
 * This route allows the creation of a new user. It expects user registration
 * data (e.g., email, password) in the request body. If the registration is
 * successful, a 201 response with the created user's data is returned.
 * Otherwise, a 400 error response is returned.
 */
router.post("/users/register", UserService.createUser);

/**
 * @route POST api/users/login
 * @desc Login an existing user
 * @access Public
 *
 * This route allows a user to log in. It expects login credentials (e.g.,
 * email and password) in the request body. If the login is successful, a
 * token is returned for authentication. If the login fails, a 400 error
 * response is returned.
 */
router.post("/users/login", UserService.login);

/**
 * @route PATCH api/users/assign-role
 * @desc Assign a role to a user
 * @access Protected (admin and project_manager only)
 *
 * This route allows an admin or project manager to assign a role to a user.
 * The user ID and the role name are provided in the request body. The role
 * assignment is processed by the service. A success message is returned
 * along with the updated user data.
 */

router.patch(
  "/users/assign-role",
  authMiddleware,
  checkRole(["admin", "project_manager"]),
  async (req, res) => {
    const { userId, roleName } = req.body;

    try {
      const updatedUser = await UserService.assignRoleToUser(userId, roleName);
      res.status(200).json({
        message: "Role assigned successfully.",
        user: updatedUser,
        assignedBy: {
          id: req.user.id,
          role: req.user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error assigning role.",
        error: error.message,
      });
    }
  }
);

/**
 * @route PATCH api/users/:userId/update
 * @desc Update a user's data
 * @access Protected (based on permission)
 *
 * This route allows a user to update their own profile or an admin to
 * update any user's profile. The user ID is passed as a URL parameter,
 * and the updated data is passed in the request body. If the update is
 * successful, a success message with the updated user data is returned.
 * If there is an error, a 500 error response is sent.
 */
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

/**
 * @route GET api/users
 * @desc Get all users
 * @access Protected (based on permission)
 *
 * This route retrieves all users. Access is restricted based on permissions.
 * If the retrieval is successful, a 200 response with the list of users is
 * returned. If there is an error, a 500 error response is returned.
 */
router.get(
  "/users",
  authMiddleware,
  checkPermission(["users:view", "*"]),
  async (req, res) => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        message: "Users retrieved successfully.",
        users: users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving users.",
        error: error.message,
      });
    }
  }
);

/**
 * @route DELETE api/users/:userId
 * @desc Delete a user
 * @access Protected (admin and project_manager only)
 *
 * This route allows an admin or project manager to delete a user. The user
 * ID is passed as a URL parameter. If the deletion is successful, a success
 * message is returned. If an error occurs, a 500 error response is returned.
 */
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
