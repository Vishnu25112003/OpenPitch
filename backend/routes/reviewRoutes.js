import express from "express";
import { likeIdea, addComment, getCommentsForPost, deleteComment,getCommentCount } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.put("/like/:id", verifyToken, likeIdea);
router.post("/:postId", verifyToken, addComment);
router.get("/:postId", getCommentsForPost);
router.delete("/:id", verifyToken, deleteComment);
router.get("/commentcount", getCommentCount);

export default router;
