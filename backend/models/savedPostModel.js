// models/savedPostModel.js
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

const SavedPost = mongoose.model("SavedPost", savedPostSchema);
export default SavedPost;
