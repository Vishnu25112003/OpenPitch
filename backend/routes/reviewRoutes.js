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

router.get("/saved", verifyToken, getSavedPosts);

router.put("/like/:id", verifyToken, likeIdea);
router.post("/:postId", verifyToken, addComment);
router.get("/:postId", getCommentsForPost);
router.delete("/:id", verifyToken, deleteComment);
router.put("/save/:postId", verifyToken, savePost);

export default router;
