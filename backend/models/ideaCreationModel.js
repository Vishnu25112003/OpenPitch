import mongoose from "mongoose";

const ideaPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    like: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    isTopPost: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const IdeaPost = mongoose.model("IdeaPost", ideaPostSchema);
export default IdeaPost;
