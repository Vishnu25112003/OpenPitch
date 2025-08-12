import express from "express";
import {
  likeIdea,
  addComment,
  getCommentsForPost,
  deleteComment,
  savePost,
  getSavedPosts,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Saved posts routes
router.get("/saved", verifyToken, getSavedPosts);
router.put("/save/:postId", verifyToken, savePost);

// Like and comment routes
router.put("/like/:id", verifyToken, likeIdea);
router.post("/:postId", verifyToken, addComment);
router.get("/:postId", getCommentsForPost);
router.delete("/:id", verifyToken, deleteComment);

export default router;
