import Registration from '../models/registrationModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Registration.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, name: user.name }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const { _id, email: userEmail, role } = user;

        res.status(200).json({
            message: "Login successful",
            user: {
                id: _id,
                email: userEmail,
                name: user.name,
                role: role,
            },
            token: token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};
