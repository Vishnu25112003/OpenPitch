import cron from "node-cron";
import IdeaPost from "../models/ideaCreationModel.js";

// ✅ Export the function
export const runTopPostCron = async () => {
  console.log("⏰ Running Top Post Cron Job...");

  try {
    // Step 1: Reset all posts to not top
    await IdeaPost.updateMany({}, { $set: { isTopPost: false } });

    // Step 2: Get top 3 liked posts
    const topPosts = await IdeaPost.aggregate([
      {
        $addFields: {
          likeCount: { $size: "$likedBy" }, // Count likes
        },
      },
      { $sort: { likeCount: -1 } }, // Sort by most likes
      { $limit: 3 }, // Take top 3
    ]);

    // Step 3: Set isTopPost = true for those 3
    const updatePromises = topPosts.map((post) =>
      IdeaPost.findByIdAndUpdate(post._id, { isTopPost: true })
    );
    await Promise.all(updatePromises);

    console.log("✅ Top posts updated!");
  } catch (err) {
    console.error("❌ Cron Error:", err);
  }
};

// ✅ Schedule daily at 12AM (keep this too)
cron.schedule("0 0 * * *", runTopPostCron);
