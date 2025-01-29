import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { DB_CONNECTION_STRING, DB_USER, DB_PASSWORD } = process.env;

mongoose
  .connect(DB_CONNECTION_STRING, {
    auth: { username: DB_USER, password: DB_PASSWORD },
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

export default mongoose;
