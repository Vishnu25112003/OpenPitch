import mongoose from "mongoose";

const ideaPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
      default: null,
    },
    reviews: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
      Comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    },
  },
  { timestamps: true }
);

const IdeaPost = mongoose.model("IdeaPost", ideaPostSchema);
export default IdeaPost;
