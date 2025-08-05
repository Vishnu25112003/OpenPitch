import express from "express";
import { likeIdea, addComment, getCommentsByIdea } from "../controllers/reviewController.js";

const router = express.Router();

router.put("/like/:id", likeIdea);

router.post("/comment", addComment);
router.get("/comment/:ideaId", getCommentsByIdea);

export default router;
