import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reaction:{
      type:Number,
      enum:["like","dislike","none"],
      default:"none",
    },
    comment: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }
)

export default mongoose.model("Review", reviewSchema);