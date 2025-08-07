import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from "./config/db.js";
import "./cron/topPostCron.js";

import registrationData from "./routes/registrationRoutes.js";
import loginData from "./routes/loginRoutes.js";
import ideaCreationData from "./routes/ideaCreationRoutes.js";
import reviewData from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use("/api/registration", registrationData);
app.use("/api/login", loginData);
app.use("/api/idea", ideaCreationData);
app.use("/api/review", reviewData);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} is running...`);
});
