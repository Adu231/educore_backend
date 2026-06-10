import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { MarketingService } from "../services/marketing.service";
import { ResponseHandler } from "../utils/response";

export class MarketingController {
  /**
   * Submit contact form info
   */
  static async recordContactInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await MarketingService.recordContactInquiry(req.body);
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Subscribe to the newsletter bulletin
   */
  static async subscribeNewsletter(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await MarketingService.subscribeNewsletter(email);
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all blog posts articles
   */
  static async getBlogPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await MarketingService.getBlogPosts();
      return ResponseHandler.success(res, posts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get detailed blog post article
   */
  static async getBlogPostDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await MarketingService.getBlogPostDetails(id);
      return ResponseHandler.success(res, post);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check out billing plan subscription transaction
   */
  static async checkoutPaymentTransaction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id || "unknown";
      const result = await MarketingService.checkoutPaymentTransaction(userId, req.body);
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
