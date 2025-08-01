import express from "express";
import { createIdea } from "../controllers/ideaCreationController.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from '../middleware/uploads.js';


const router = express.Router();

router.post('/create', verifyToken,upload.single("image"), 
  createIdea
);

export default router;


