import express from "express";
import {
  createIdea,
  getAllIdeas,
  getTopPosts,
  deleteIdea,
} from "../controllers/ideaCreationController.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from '../middleware/uploads.js';
import { runTopPostCron } from "../cron/topPostCron.js";

const router = express.Router();

router.post('/create', verifyToken,upload.single("image"), 
  createIdea
);
router.get('/ideas', getAllIdeas);
router.get('/toppost', getTopPosts);
router.get("/runcron", runTopPostCron);
router.delete("/delete/:id", verifyToken, deleteIdea);

export default router;
