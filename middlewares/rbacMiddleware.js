import Role from "../config/roleConfig.js";

const role = new Role();

const checkPermission = (permissions) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const grants = role.getRoleGrants(userRole);
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
    const userRole = req.user.role;
    if (requiredRoles.includes(userRole)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Forbidden: You don't have the required role." });
  };
};

export { checkPermission, checkRole };
