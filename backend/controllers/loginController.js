import Registration from '../models/registrationModel.js';
import bcrypt from 'bcryptjs';

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
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
}

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Registration.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        res.status(200).json({ message: "Admin login successful", admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
