"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const env_1 = require("../config/env");
const errors_1 = require("../utils/errors");
class AuthService {
    /**
     * Log in a user and return a JWT token and user info
     */
    static async login(email, password, role) {
        if (!email || !password || !role) {
            throw new errors_1.BadRequestError("Email, password, and role are required.");
        }
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new errors_1.UnauthorizedError("Invalid email, password, or role selection.");
        }
        if (user.role !== role) {
            throw new errors_1.UnauthorizedError("Unauthorized role access.");
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new errors_1.UnauthorizedError("Invalid credentials.");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, env_1.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        return {
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
                joinDate: user.joinDate,
                profileCompleted: user.profileCompleted
            }
        };
    }
    /**
     * Register a new user
     */
    static async register(name, email, password, role) {
        if (!name || !email || !password || !role) {
            throw new errors_1.BadRequestError("All fields are required.");
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new errors_1.BadRequestError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
        }
        const existingUser = await User_1.User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new errors_1.BadRequestError("User already registered.");
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const customId = (role === "admin" ? "AD" : "CS") + Date.now().toString().slice(-7);
        const newUser = new User_1.User({
            id: customId,
            name,
            email,
            passwordHash,
            role,
            rollNumber: role === "student" ? customId : undefined,
            joinDate: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long"
            })
        });
        await newUser.save();
        return {
            message: "Account created successfully. Please log in.",
            userId: newUser.id
        };
    }
    /**
     * Mock a forgot password link transmission
     */
    static async forgotPassword(email) {
        if (!email) {
            throw new errors_1.BadRequestError("Email is required.");
        }
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new errors_1.NotFoundError("User not found.");
        }
        return { message: `Password reset link sent to ${email}` };
    }
    /**
     * Update profile details
     */
    static async updateProfile(userId, name, phone, address, department, semester, profileCompleted) {
        if (phone && !/^\d{10}$/.test(phone)) {
            throw new errors_1.BadRequestError("Mobile number must be exactly 10 digits.");
        }
        const user = await User_1.User.findOneAndUpdate({ id: userId }, { $set: { name, phone, address, department, semester, profileCompleted } }, { new: true });
        if (!user) {
            throw new errors_1.NotFoundError("User profile not found.");
        }
        return {
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
                address: user.address,
                profileCompleted: user.profileCompleted
            }
        };
    }
    /**
     * Update profile avatar
     */
    static async updateAvatar(userId, avatarUrl) {
        if (!avatarUrl) {
            throw new errors_1.BadRequestError("Avatar URL is required.");
        }
        const user = await User_1.User.findOneAndUpdate({ id: userId }, { $set: { avatar: avatarUrl } }, { new: true });
        if (!user) {
            throw new errors_1.NotFoundError("User not found.");
        }
        return { avatarUrl: user.avatar };
    }
    /**
     * Change user password
     */
    static async changePassword(userId, oldPassword, newPassword) {
        if (!oldPassword || !newPassword) {
            throw new errors_1.BadRequestError("Both current password and new password are required.");
        }
        const user = await User_1.User.findOne({ id: userId });
        if (!user) {
            throw new errors_1.NotFoundError("User not found.");
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            throw new errors_1.BadRequestError("Current password is incorrect.");
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            throw new errors_1.BadRequestError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
        }
        user.passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        return { message: "Password updated successfully." };
    }
}
exports.AuthService = AuthService;
