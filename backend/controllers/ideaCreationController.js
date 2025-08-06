
import IdeaPost from "../models/ideaCreationModel.js";

export const createIdea = async (req, res) => {
  try {
    console.log("User in request:", req.user); 

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    const { title, description, category } = req.body;

    const newIdea = new IdeaPost({
      userId, 
      title,
      description,
      category,
      image: req.file ? req.file.filename : null, 
    });

    await newIdea.save();

    res.status(201).json({ message: "Idea posted successfully", idea: newIdea });
  } catch (error) {
    console.error("Idea post failed:", error);
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
    console.error("Error getting ideas:", error); 
    res.status(500).json({ error: error.message });
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


