import Idea from "../models/ideaCreationModel.js"; 
import Comment from "../models/reviewModel.js";


export const likeIdea = async (req, res) => {
  try {
    const ideaId = req.params.id;
    const userId = req.user.id; 

    const idea = await Idea.findById(ideaId);

    if (!idea) return res.status(404).json({ message: "Idea not found" });

    if (idea.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You already liked this idea." });
    }

    idea.like += 1;
    idea.likedBy.push(userId);
    await idea.save();

    res.json({ like: idea.like });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



export const addComment = async (req, res) => {
  try {
    const { content, ideaId, userId } = req.body;

    const newComment = new Comment({ content, ideaId, userId });
    const saved = await newComment.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommentsByIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const comments = await Comment.find({ ideaId })
      .populate("userId", "name")
      .sort({ createdAt: -1 }); 
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
