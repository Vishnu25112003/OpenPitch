import IdeaPost from "../models/ideaCreationModel.js";

export const createIdea = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { title, description, category } = req.body;

    const newIdea = new IdeaPost({
      userId,
      title,
      description,
      category,
      image: req.file ? req.file.filename : null,
    });

    await newIdea.save();
    res
      .status(201)
      .json({ message: "Idea posted successfully", idea: newIdea });
  } catch (error) {
    res.status(500).json({ message: "Server error while posting your idea" });
  }
};

export const getAllIdeas = async (req, res) => {
  try {
    const ideas = await IdeaPost.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIdeaById = async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await IdeaPost.findById(id).populate("userId", "name");

    if (!idea) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching post" });
  }
};

export const getTopPosts = async (req, res) => {
  try {
    const topPosts = await IdeaPost.aggregate([
      { $match: { isTopPost: true } },
      {
        $addFields: {
          likeCount: { $size: "$likedBy" },
        },
      },
      { $sort: { likeCount: -1 } },
    ]);
    res.status(200).json(topPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching top posts", error });
  }
};

export const deleteIdea = async (req, res) => {
  try {
    await IdeaPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting post" });
  }
};
