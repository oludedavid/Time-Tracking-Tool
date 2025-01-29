import express from "express";
import RoleService from "../services/roleService.js";

const router = express.Router();

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

router.get("/roles", async (req, res) => {
  try {
    const roles = await RoleService.getRoles();
    res.status(200).json({ roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
