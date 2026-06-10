"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "supersecure_randomsecretkey_educore2026";
// Login User
router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ error: "Email, password, and role are required." });
    }
    try {
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid email, password, or role selection." });
        }
        if (user.role !== role) {
            return res.status(401).json({ error: "Unauthorized role access." });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                rollNumber: user.rollNumber,
                department: user.department,
                semester: user.semester,
                phone: user.phone,
                address: user.address,
                joinDate: user.joinDate
            }
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Server login error." });
    }
});
// Register User
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const existingUser = await User_1.User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: "User already registered." });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const customId = (role === "admin" ? "AD" : "CS") + Date.now().toString().slice(-7);
        const newUser = new User_1.User({
            id: customId,
            name,
            email,
            passwordHash,
            role,
            joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })
        });
        await newUser.save();
        return res.status(201).json({ message: "Account created successfully. Please log in.", userId: newUser.id });
    }
    catch (err) {
        return res.status(500).json({ error: "Server registration error." });
    }
});
// Forgot Password
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }
    try {
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.json({ message: `Password reset link sent to ${email}` });
    }
    catch (err) {
        return res.status(500).json({ error: "Forgot password operation failed." });
    }
});
// Update Profile details
router.put("/profile/update", auth_1.authMiddleware, async (req, res) => {
    const { name, phone, address } = req.body;
    try {
        const user = await User_1.User.findOneAndUpdate({ id: req.user?.id }, { $set: { name, phone, address } }, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User profile not found." });
        }
        return res.json({
            message: "Profile updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                rollNumber: user.rollNumber,
                department: user.department,
                semester: user.semester,
                phone: user.phone,
                address: user.address
            }
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to update profile." });
    }
});
// Upload Profile Picture (Avatar)
router.patch("/profile/avatar", auth_1.authMiddleware, async (req, res) => {
    const { avatarUrl } = req.body; // In production, we'd handle file upload. Locally, accept mock avatarUrl string.
    if (!avatarUrl) {
        return res.status(400).json({ error: "Avatar URL is required." });
    }
    try {
        const user = await User_1.User.findOneAndUpdate({ id: req.user?.id }, { $set: { avatar: avatarUrl } }, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.json({ avatarUrl: user.avatar });
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to update profile picture." });
    }
});
exports.default = router;
