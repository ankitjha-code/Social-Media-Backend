import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminFirstSetup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new Admin({
      username: "admin",
      password: hashedPassword,
    });
    await admin.save();
    res.status(201).json({ message: "Admin user created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
