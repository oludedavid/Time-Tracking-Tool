const roleSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
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
