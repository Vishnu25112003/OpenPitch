import express from "express";
const router = express.Router();
import { registerUser,registerAdmin, getUserProfile,updateUserProfile, getUserCount, deleteUserProfile } from "../controllers/registrationController.js";

router.post("/register/user", registerUser);
router.post("/register/admin", registerAdmin);
router.get("/users", getUserProfile);
router.put("/update/:id", updateUserProfile);
router.get("/usercount", getUserCount);
router.delete("/delete/:id", deleteUserProfile);

export default router;