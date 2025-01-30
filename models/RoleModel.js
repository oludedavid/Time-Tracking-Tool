import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    enum: ["admin", "freelancer", "project_manager"],
    required: true,
  },

  grants: {
    type: [String],
    required: true,
  },
});

export default mongoose.model("Role", roleSchema);
