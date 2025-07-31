import IdeaCreation from "../models/ideaCreationModel.js";

export const createIdea = async (req, res) => {
  try {
    console.log("Incoming idea post request...");
    console.log("User:", req.user);
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const { title, description, category } = req.body;
    const userId = req.user._id;

    const image = req.files?.image?.[0];
    const video = req.files?.video?.[0];

    const newIdea = new IdeaCreation({
      title,
      description,
      category,
      media: {
        imageUrl: image?.filename,
        videoUrl: video?.filename
      },
      createdBy: userId
    });

    const savedIdea = await newIdea.save();
    res.status(201).json({ message: "Idea created successfully", savedIdea });
  } catch (error) {
    console.error("Idea post error:", error);
    res.status(500).json({ message: "Failed to create idea" });
  }
};
