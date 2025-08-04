import Review from "../models/reviewModel.js";

export const likeIdea = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userId;

    let review = await Review.findOne({ postId, userId });

    if (review) {
      review.like = true;
    } else {
      review = new Review({ postId, userId, like: true });
    }

    await review.save();
    res.status(200).json({ message: "Liked successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.userId;

    const newReview = new Review({ postId, userId, comment });
    await newReview.save();

    res.status(201).json({ message: "Comment posted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getIdeaReviewSummary = async (req, res) => {
  try {
    const { postId } = req.params;

    const reviews = await Review.find({ postId }).populate("userId", "name");

    const likeCount = reviews.filter(r => r.like).length;
    const comments = reviews
      .filter(r => r.comment)
      .map(r => ({
        user: r.userId.name,
        comment: r.comment,
        time: r.createdAt,
      }));

    res.status(200).json({ likeCount, comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
