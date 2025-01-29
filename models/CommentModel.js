import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workinghoursEntryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkingHours",
      required: true,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
      },
    ],
  },

  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
