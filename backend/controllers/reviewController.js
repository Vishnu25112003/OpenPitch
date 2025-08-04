import Comment from "../models/reviewModel.js";

export const postComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const ideaId = req.params;
    const userId = req.user.userId;

    const newComment = new Comment({
      comment,
      userId,
      ideaId,
    });

    const saved = await newComment.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

export const putLike = async (req, res) => {
  try {
    const review = await Comment.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    review.like += 1;
    await review.save();
    res.status(200).json({
      success: true,
      message: "Like added successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add like",
      error: error.message,
    });
  }
};
