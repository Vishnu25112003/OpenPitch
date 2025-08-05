import express from "express";
import { likeIdea, addComment, getCommentsByIdea } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.put("/like/:id", verifyToken, likeIdea);
router.post("/comment", addComment);
router.get("/comment/:ideaId", getCommentsByIdea);

export default router;
