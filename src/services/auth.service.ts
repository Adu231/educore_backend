import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { env } from "../config/env";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError
} from "../utils/errors";

export class AuthService {
  /**
   * Log in a user and return a JWT token and user info
   */
  static async login(email: string, password: string, role: string) {
    if (!email || !password || !role) {
      throw new BadRequestError("Email, password, and role are required.");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedError("Invalid email, password, or role selection.");
    }

    if (user.role !== role) {
      throw new UnauthorizedError("Unauthorized role access.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials.");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
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
  static async register(name: string, email: string, password: string, role: "student" | "admin") {
    if (!name || !email || !password || !role) {
      throw new BadRequestError("All fields are required.");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new BadRequestError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new BadRequestError("User already registered.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const customId = (role === "admin" ? "AD" : "CS") + Date.now().toString().slice(-7);

    const newUser = new User({
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
  static async forgotPassword(email: string) {
    if (!email) {
      throw new BadRequestError("Email is required.");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return { message: `Password reset link sent to ${email}` };
  }

  /**
   * Update profile details
   */
  static async updateProfile(userId: string, name?: string, phone?: string, address?: string, department?: string, semester?: string, profileCompleted?: boolean) {
    if (phone && !/^\d{10}$/.test(phone)) {
      throw new BadRequestError("Mobile number must be exactly 10 digits.");
    }

    const user = await User.findOneAndUpdate(
      { id: userId },
      { $set: { name, phone, address, department, semester, profileCompleted } },
      { new: true }
    );

    if (!user) {
      throw new NotFoundError("User profile not found.");
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
  static async updateAvatar(userId: string, avatarUrl: string) {
    if (!avatarUrl) {
      throw new BadRequestError("Avatar URL is required.");
    }

    const user = await User.findOneAndUpdate(
      { id: userId },
      { $set: { avatar: avatarUrl } },
      { new: true }
    );

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return { avatarUrl: user.avatar };
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, oldPassword?: string, newPassword?: string) {
    if (!oldPassword || !newPassword) {
      throw new BadRequestError("Both current password and new password are required.");
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new BadRequestError("Current password is incorrect.");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new BadRequestError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: "Password updated successfully." };
  }
}
