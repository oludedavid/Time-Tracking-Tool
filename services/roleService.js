import Role from "../config/roleConfig.js";
import RoleModel from "../models/RoleModel.js";

class RoleService {
  /**
   * Creates a new role in the database.
   * @param {String} name - The name of the role to be created.
   * @returns {Object} - The newly created role.
   * @throws {Error} - If the role does not exist in the configuration or already exists in the database.
   */
  static async createRole(name) {
    const role = new Role();

    // Check if the role exists in the configuration
    const roleExistsInConfig = role.checkRoleExists(name);
    if (!roleExistsInConfig) {
      throw new Error("Role does not exist in the configuration.");
    }

    // Check if the role already exists in the database
    const roleExistsInDb = await RoleModel.findOne({ roleName: name });
    if (roleExistsInDb) {
      throw new Error("Role already exists in the database.");
    }

    // Retrieve the grants associated with the role from the configuration
    const grants = role.getRoleGrants(name);

    // Create a new role instance
    const newRole = new RoleModel({
      roleName: name,
      grants: grants,
    });

    try {
      // Save the new role to the database
      await newRole.save();
      return newRole;
    } catch (error) {
      // Handle and throw any errors that occur during the save operation
      throw new Error("Error creating role: " + error.message);
    }
  }

  /**
   * Retrieves all roles from the database.
   * @returns {Array} - An array of roles.
   * @throws {Error} - If an error occurs while retrieving the roles.
   */
  static async getRoles() {
    try {
      const roles = await RoleModel.find();
      return roles;
    } catch (error) {
      throw new Error("Error getting roles: " + error.message);
    }
  }

  /**
   * Retrieves a specific role by its name.
   * @param {String} name - The name of the role to retrieve.
   * @returns {Object} - The role object.
   * @throws {Error} - If the role is not found or an error occurs.
   */
  static async getRoleByName(name) {
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

  /**
   * Updates the grants of a role by its name.
   * @param {String} name - The name of the role to update.
   * @param {Array} grants - The new grants to assign to the role.
   * @returns {Object} - The updated role object.
   * @throws {Error} - If the role is not found or an error occurs during the update.
   */
  static async updateRole(name, grants) {
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

  /**
   * Deletes a role by its name from the database.
   * @param {String} name - The name of the role to delete.
   * @returns {Object} - The deleted role object.
   * @throws {Error} - If the role is not found or an error occurs during deletion.
   */
  static async deleteRole(name) {
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

export default RoleService;
