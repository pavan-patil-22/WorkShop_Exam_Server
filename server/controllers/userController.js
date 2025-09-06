import User from "../models/user.js";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
// Register user
export const register = async (req, res) => {
    try {
        const { name, email, contact, password,usn } = req.body;
        console.log(name, email, contact, password,usn)
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePic = req.file ? req.file.filename : "";
        const user = new User({
            usn,
            name,
            email,
            contact,
            profilePic,
            password: hashedPassword,
        });
        await user.save();
        res.json({ message: "User registered successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ message: "Login successful", token,user});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const updates = req.body;

        if (req.file) updates.profilePic = req.file.filename;
        if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
        res.json({ message: "User updated successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//change password
export const changePassword = async (req, res) => {
    try {
        // console.log("🔐 Change password request received");

        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        //console.log("📦 Request body:", { oldPassword, newPassword });
        //console.log("👤 User ID from token:", userId);

        const user = await User.findById(userId);
        if (!user) {
          //  console.log("❌ User not found");
            return res.status(404).json({ error: "User not found" });
        }

        //console.log("✅ User found:", user.email || user.username || user._id);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        //console.log("🔍 Password match result:", isMatch);

        if (!isMatch) {
            console.log("❌ Old password does not match");
            return res.status(400).json({ error: "Old password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        //console.log("🔑 New password hashed");

        user.password = hashedNewPassword;
        await user.save();

        //console.log("✅ Password updated successfully");

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("🔥 Error changing password:", err);
        res.status(500).json({ error: err.message });
    }
};



//ForgotPassword

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Generate 4-digit random password
        const tempPassword = Math.floor(1000 + Math.random() * 9000).toString();

        // Hash and save
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        user.password = hashedPassword;
        console.log(password);
        await user.save();

        // Setup nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL, // Your Gmail
                pass: process.env.EMAIL_PASSWORD  // App Password
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Temporary Password",
            text: `Your temporary password is: ${tempPassword}. Please log in and change it immediately.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Temporary password sent to your email" });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
};
