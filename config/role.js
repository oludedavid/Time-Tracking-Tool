const rolesData = require("./roles.json");

class Role {
  constructor() {
    this.roles = rolesData.roles;
  }

  checkRoleExists(roleName) {
    return this.roles.some((role) => role.name === roleName);
  }

  getRoleGrants(roleName) {
    const role = this.roles.find((role) => role.name === roleName);
    if (role) {
      return role.grants;
    }
    return null;
  }

  getRoleByName(name) {
    return this.roles.find((role) => role.name === name);
  }

  getRoles() {
    return this.roles;
  }
}

module.exports = Role;
