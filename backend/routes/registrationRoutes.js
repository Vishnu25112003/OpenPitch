import express from "express";
const router = express.Router();
import { registerUser,registerAdmin, getAllRegistrations } from "../controllers/registrationController.js";

router.post("/register/user", registerUser);
router.post("/register/admin", registerAdmin);
router.get("/users", getAllRegistrations);

export default router;