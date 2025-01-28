const Role = require("../config/role");

const role = new Role();

// Middleware to check user permissions
const checkPermission = (permissions) => {
  return (req, res, next) => {
    //assume the user is already authenticated and the user role is stored in req.user.role
    const userRole = req.user.role;
    const grants = role.getRoleGrants(userRole);

    // Check if user has at least one of the required permissions
    if (
      grants &&
      permissions.some((permission) => grants.includes(permission))
    ) {
      return next();
    }

    return res.status(403).json({
      message: "Forbidden: You don't have the required permission.",
    });
  };
};

const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    //assume the user is already authenticated and the user role is stored in req.user.role
    const userRole = req.user.role;
    if (requiredRoles.includes(userRole)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Forbidden: You don't have the required role." });
  };
};

module.exports = {
  checkPermission,
  checkRole,
};
