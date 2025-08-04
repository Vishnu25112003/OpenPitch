import express from "express";
import { likeIdea, postComment, getIdeaReviewSummary } from "../controllers/reviewController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/like", verifyToken, likeIdea);
router.post("/comment", verifyToken, postComment);
router.get("/summary/:postId", getIdeaReviewSummary);

export default router;
