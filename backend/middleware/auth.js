import jwt from "jsonwebtoken";

export const verifytoken = (req,res,next) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({message: 'Access denied. No token provided.'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({message: 'Invalid token or token expired'});
    }
};