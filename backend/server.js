import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();

import connectDB from "./config/db.js";
connectDB();
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials: true,
    }
));
app.use(express.json());

import registrationData from "./routes/registrationRoutes.js";
import loginData from "./routes/loginRoutes.js";  
import ideaCreationData from "./routes/ideaCreationRoutes.js";  

app.use("/api/registration", registrationData);
app.use("/api/login", loginData);
app.use("/api/idea", ideaCreationData);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
    console.log(`Server ${PORT} is running...`)
);                                  