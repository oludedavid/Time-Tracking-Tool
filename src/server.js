import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import "../db/mongoose.js";
import communicationRoutes from "../routes/communicationRoute.js";
import userRoutes from "../routes/userRoute.js";
import roleRoutes from "../routes/roleRoute.js";
import projectsRoutes from "../routes/projectsRoute.js";
import workingHoursRoutes from "../routes/workingHoursRoute.js";
import { limiter } from "../helpers/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(limiter);

app.use("/api", communicationRoutes);
app.use("/api", userRoutes);
app.use("/api", roleRoutes);
app.use("/api", projectsRoutes);
app.use("/api", workingHoursRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message || "Validation Error",
    });
  }

  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate key error",
    });
  }

  if (
    ["ForbiddenError", "NotFoundError", "UnauthorizedError"].includes(err.name)
  ) {
    return res.status(err.status || 500).json({
      success: false,
      code: err.code || "ERROR",
      message: err.message || "An error occurred",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Global Error Handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
