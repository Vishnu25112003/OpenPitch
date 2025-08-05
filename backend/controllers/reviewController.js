import IdeaPost from "../models/ideaCreationModel.js";
import Comment from "../models/reviewModel.js";

export const likeIdea = async (req, res) => {
  try {
    const ideaId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found" });
    }

    const idea = await IdeaPost.findById(ideaId);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const alreadyLiked = idea.likedBy.includes(userId);

    if (alreadyLiked) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }

    idea.likedBy.push(userId);
    idea.like += 1;

    await idea.save();

    return res
      .status(200)
      .json({ message: "Post liked successfully", like: idea.like });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Server error while liking the post" });
  }
};


export const addComment = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { postId } = req.params;
    const { commentText } = req.body;

    if (!commentText) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const comment = new Comment({
      postId,
      userId,
      commentText,
    });

    await comment.save();

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("userId", "name") // Only get user name
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error getting comments", error });
  }
};
