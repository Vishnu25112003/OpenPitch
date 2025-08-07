import cron from "node-cron";
import IdeaPost from "../models/ideaCreationModel.js";

export const runTopPostCron = async () => {
  try {
    await IdeaPost.updateMany({}, { $set: { isTopPost: false } });
    const topPosts = await IdeaPost.aggregate([
      {
        $addFields: {
          likeCount: { $size: "$likedBy" }, 
        },
      },
      { $sort: { likeCount: -1 } }, 
      { $limit: 3 },
    ]);
    const updatePromises = topPosts.map((post) =>
      IdeaPost.findByIdAndUpdate(post._id, { isTopPost: true })
    );
    await Promise.all(updatePromises);

    console.log("Top posts updated!");
  } catch (err) {
    console.error("Cron Error:", err);
  }
};
cron.schedule("0 0 * * *", runTopPostCron);
