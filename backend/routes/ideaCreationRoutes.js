import express from "express";
import { createIdea } from "../controllers/ideaCreationController.js";
import { upload } from "../middleware/uploads.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, upload.fields([
    { name: "image" },
    { name: "video" }
  ]), createIdea
);

export default router;
