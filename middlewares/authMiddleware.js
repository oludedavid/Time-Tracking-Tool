import { verifyToken } from "../helpers/index.js";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = await verifyToken(token);

    if (decoded.valid) {
      req.user = {
        id: decoded.payload.userId,
        role: decoded.payload.userRole,
      };
      return next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Invalid token." });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
      details: error.message,
    });
  }
};

export default authMiddleware;
