import express from "express";
import { createIdea } from "../controllers/ideaCreationController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createIdea);

export default router;
