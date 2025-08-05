import express from "express";
const router = express.Router();
import { registerUser,registerAdmin, getUserProfile } from "../controllers/registrationController.js";

router.post("/register/user", registerUser);
router.post("/register/admin", registerAdmin);
router.get("/users", getUserProfile);

export default router;