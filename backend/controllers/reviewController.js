import IdeaPost from "../models/ideaCreationModel.js";
import Comment from "../models/reviewModel.js";
import SavedPost from "../models/savedPostModel.js";

export const likeIdea = async (req, res) => {
  try {
    const ideaId = req.params.id;
    const userId = req.user.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found" });
    }

    const idea = await IdeaPost.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const index = idea.likedBy.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (index !== -1) {
      idea.likedBy.splice(index, 1);
    } else {
      idea.likedBy.push(userId);
    }

    idea.like = idea.likedBy.length;
    await idea.save();

    return res.status(200).json({
      message: index !== -1 ? "Like removed" : "Post liked",
      like: idea.like,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res
      .status(500)
      .json({ message: "Server error while toggling like", error });
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
    await IdeaPost.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error getting comments", error });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

export const savePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await IdeaPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingSave = await SavedPost.findOne({ postId, userId });

    if (existingSave) {
      await SavedPost.deleteOne({ postId, userId });
      return res.status(200).json({
        message: "Post removed from saved posts",
        isSaved: false,
      });
    } else {
      await SavedPost.create({ postId, userId });
      return res.status(200).json({
        message: "Post saved successfully",
        isSaved: true,
      });
    }
  } catch (error) {
    console.error("Error saving post:", error);
    res
      .status(500)
      .json({ message: "Error saving post", error: error.message });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const savedPosts = await SavedPost.find({ userId })
      .populate({
        path: "postId",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    const validSavedPosts = savedPosts
      .filter((saved) => saved.postId !== null)
      .map((saved) => saved.postId);

    res.status(200).json(validSavedPosts);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res
      .status(500)
      .json({ message: "Error fetching saved posts", error: error.message });
  }
};
