import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IdeaPost",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate saves
savedPostSchema.index({ postId: 1, userId: 1 }, { unique: true });

const SavedPost = mongoose.model("SavedPost", savedPostSchema);
export default SavedPost;
