import jwt from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const jwtSecret = process.env.JWT_SECRET;
const algorithm = process.env.JWT_ALGORITHM;
const expireTime = process.env.JWT_DEFAULT_EXPIRY;
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

/**
 * Generate a Secure JWT Token
 * @param {Object} payload - The data to be encoded in the token
 * @returns {Promise<string>} The generated JWT token
 */
const generateSecureToken = async (payload) => {
  try {
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: expireTime,
      algorithm: algorithm,
      jwtid: crypto.randomBytes(16).toString("hex"),
      header: {
        typ: "JWT",
        alg: algorithm,
      },
    });

    return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error("Failed to generate secure token");
  }
};
/**
 * Verify  JWT Token
 * @param {String} token - The token to be decoded
 * @returns {Promise<string>} The decoded JWT token
 */
const verifyToken = async (token) => {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Invalid token format");
    }

    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: [algorithm],
      ignoreExpiration: false,
      clockTolerance: 15,
    });
    return {
      valid: true,
      payload: decoded,
      expired: false,
    };
  } catch (error) {
    const isExpired = error.name === "TokenExpiredError";
    return {
      valid: false,
      expired: isExpired,
      error: isExpired ? "Token expired" : "Invalid token",
      details: error.message,
    };
  }
};

async function sendVerificationEmail(email, fullName) {
  const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_TRANSPORTER_USER_MAIL,
      pass: process.env.EMAIL_TRANSPORTER_USER_PASSWORD,
    },
  });
  const emailVerificationToken = await generateSecureToken({
    email,
    fullName,
  });
  const verificationUrl = `http://localhost:3000/verify-email?token=${emailVerificationToken}`;
  const mailOptions = {
    from: process.env.EMAIL_TRANSPORTER_USER_MAIL,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Welcome to Our Platform!</h2>
        <p>Hi ${fullName},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" 
            style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </p>
        <p>If the button doesn't work, use the following link:</p>
        <p>${verificationUrl}</p>
        <p>If you didn't request this registration, please ignore this email or contact support.</p>
      </div>
    `,
  };

  await emailTransporter.sendMail(mailOptions);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

export { generateSecureToken, sendVerificationEmail, verifyToken, limiter };
