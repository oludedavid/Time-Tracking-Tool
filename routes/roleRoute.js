import express from "express";
import RoleService from "../services/roleService.js";

const router = express.Router();

/**
 * @route POST api/roles
 * @desc Create a new role
 * @access Public
 *
 * This route allows the creation of a new role. It expects a 'name' field
 * in the request body. If the role is created successfully, a 201 response
 * with the created role data is returned. Otherwise, a 400 error response
 * is sent with the error message.
 */
router.post("/roles", async (req, res) => {
  const { name } = req.body;
  try {
    const newRole = await RoleService.createRole(name);
    res
      .status(201)
      .json({ message: "Role created successfully.", role: newRole });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route GET api/roles
 * @desc Get all roles
 * @access Public
 *
 * This route retrieves all roles from the system. If the roles are fetched
 * successfully, a 200 response with a list of roles is returned. If there
 * is an error, a 500 error response is returned with the error message.
 */
router.get("/roles", async (req, res) => {
  try {
    const roles = await RoleService.getRoles();
    res.status(200).json({ roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route PATCH api/roles/:name
 * @desc Update a role by name
 * @access Public
 *
 * This route updates the grants for a role. The role name is passed as a
 * parameter in the URL, and the new grants are passed in the request body.
 * If the role is updated successfully, a 200 response with the updated role
 * is returned. If the role is not found, a 404 error response is returned.
 */
router.get("/roles/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const role = await RoleService.getRoleByName(name);
    res.status(200).json({ role });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.patch("/roles/:name", async (req, res) => {
  const { name } = req.params;
  const { grants } = req.body;
  try {
    const updatedRole = await RoleService.updateRole(name, grants);
    res
      .status(200)
      .json({ message: "Role updated successfully.", role: updatedRole });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @route DELETE api/roles/:name
 * @desc Delete a role by name
 * @access Public
 *
 * This route deletes a specific role by its name. The role name is passed
 * as a parameter in the URL. If the role is deleted successfully, a 200
 * response with a success message is returned. If the role is not found,
 * a 404 error response is returned.
 */
router.delete("/roles/:name", async (req, res) => {
  const { name } = req.params;
  try {
    await RoleService.deleteRole(name);
    res.status(200).json({ message: "Role deleted successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
