import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.JWT_SECRET;

export default function auth(user){
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
    };
    return jwt.sign(payload, token, { expiresIn: '1h' });
}

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};


