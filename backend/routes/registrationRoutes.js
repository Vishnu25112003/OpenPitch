import express from "express";
const router = express.Router();
import { registerUser,registerAdmin, getUserProfile,updateUserProfile } from "../controllers/registrationController.js";

router.post("/register/user", registerUser);
router.post("/register/admin", registerAdmin);
router.get("/users", getUserProfile);
router.put("/update/:id", updateUserProfile);

export default router;