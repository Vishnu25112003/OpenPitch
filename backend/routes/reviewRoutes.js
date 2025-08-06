import express from "express";
import { likeIdea, addComment, getCommentsForPost, deleteComment  } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.put("/like/:id", verifyToken, likeIdea);
router.post("/:postId", verifyToken, addComment);
router.get("/:postId", getCommentsForPost);
router.delete("/:id", verifyToken, deleteComment);

export default router;
