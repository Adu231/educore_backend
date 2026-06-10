import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { AuthService } from "../services/auth.service";
import { ResponseHandler } from "../utils/response";
import { BadRequestError } from "../utils/errors";

export class AuthController {
  /**
   * Log in user
   */
  static async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body;
      const result = await AuthService.login(email, password, role);
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Register user
   */
  static async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      const result = await AuthService.register(name, email, password, role);
      return ResponseHandler.success(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Forgot password request
   */
  static async forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update profile details
   */
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User authentication context missing.");
      }
      const { name, phone, address, department, semester, profileCompleted } = req.body;
      const result = await AuthService.updateProfile(userId, name, phone, address, department, semester, profileCompleted);
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload / update avatar image URL
   */
  static async updateAvatar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User authentication context missing.");
      }
      const { avatarUrl } = req.body;
      const result = await AuthService.updateAvatar(userId, avatarUrl);
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user password
   */
  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestError("User authentication context missing.");
      }
      const { oldPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(userId, oldPassword, newPassword);
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
