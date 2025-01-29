import jwt from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

/**
 * Generate a Secure JWT Token
 * @param {Object} payload - The data to be encoded in the token
 * @returns {Promise<string>} The generated JWT token
 */
const generateSecureToken = async (payload) => {
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "1h",
    algorithm: "HS256",
    jwtid: crypto.randomBytes(16).toString("hex"),
  });

  return token;
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

export { generateSecureToken, limiter };
