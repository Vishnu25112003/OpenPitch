// backend/controllers/ideaCreationController.js

import IdeaPost from "../models/ideaCreationModel.js";

export const createIdea = async (req, res) => {
  try {
    console.log("User in request:", req.user); // ✅ check if req.user exists

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    const { title, description, category, contentType } = req.body;

    const newIdea = new IdeaPost({
      userId, 
      title,
      description,
      category,
      contentType,
      media: req.file?.filename || null, 
    });

    await newIdea.save();

    res.status(201).json({ message: "Idea posted successfully", idea: newIdea });
  } catch (error) {
    console.error("Idea post failed:", error);
    res.status(500).json({ message: "Server error while posting your idea" });
  }
};
