import express from "express";
const router = express.Router();

import { createIdea } from "../controllers/ideaCreationController.js";
import { verifyToken } from "../middleware/auth.js";

router.post("/create",verifyToken, createIdea);

export default router;