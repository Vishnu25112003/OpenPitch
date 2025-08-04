import express from "express";
import {  postComment, putLike } from "../controllers/reviewController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/comment/:ideaId", verifyToken, postComment);
router.put("like/:id", putLike);

export default router;
