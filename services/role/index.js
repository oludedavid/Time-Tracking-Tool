const Role = require("../../config/role");
const RoleModel = require("../../models/RoleModel");

class RoleService {
  async createRole(name) {
    const role = new Role();

    const roleExistsInConfig = role.checkRoleExists(name);
    if (!roleExistsInConfig) {
      throw new Error("Role does not exist in the configuration.");
    }

    const roleExistsInDb = await RoleModel.findOne({ roleName: name });
    if (roleExistsInDb) {
      throw new Error("Role already exists in the database.");
    }

    const grants = role.getRoleGrants(name);

    const newRole = new RoleModel({
      roleName: name,
      grants: grants,
    });

    try {
      await newRole.save();
      return newRole;
    } catch (error) {
      throw new Error("Error creating role: " + error.message);
    }
  }

  async getRoles() {
    try {
      const roles = await RoleModel.find();
      return roles;
    } catch (error) {
      throw new Error("Error getting roles: " + error.message);
    }
  }

  // Method to get a role by name
  async getRoleByName(name) {
    try {
      const role = await RoleModel.findOne({ roleName: name });
      if (!role) {
        throw new Error("Role not found.");
      }
      return role;
    } catch (error) {
      throw new Error("Error getting role: " + error.message);
    }
  }

  // Method to update a role by name
  async updateRole(name, grants) {
    try {
      const role = await RoleModel.findOneAndUpdate(
        { roleName: name },
        { grants: grants },
        { new: true }
      );
      if (!role) {
        throw new Error("Role not found.");
      }
      return role;
    } catch (error) {
      throw new Error("Error updating role: " + error.message);
    }
  }

  // Method to delete a role by name
  async deleteRole(name) {
    try {
      const role = await RoleModel.findOneAndDelete({ roleName: name });
      if (!role) {
        throw new Error("Role not found.");
      }
      return role;
    } catch (error) {
      throw new Error("Error deleting role: " + error.message);
    }
  }
}

module.exports = RoleService;
