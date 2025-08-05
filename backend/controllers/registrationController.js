import Registration from "../models/registrationModel.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Registration({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Registration({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered Successfully", newAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const users = await Registration.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

