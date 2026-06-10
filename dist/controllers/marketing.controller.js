"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingController = void 0;
const marketing_service_1 = require("../services/marketing.service");
const response_1 = require("../utils/response");
class MarketingController {
    /**
     * Submit contact form info
     */
    static async recordContactInquiry(req, res, next) {
        try {
            const result = await marketing_service_1.MarketingService.recordContactInquiry(req.body);
            return response_1.ResponseHandler.success(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Subscribe to the newsletter bulletin
     */
    static async subscribeNewsletter(req, res, next) {
        try {
            const { email } = req.body;
            const result = await marketing_service_1.MarketingService.subscribeNewsletter(email);
            return response_1.ResponseHandler.success(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all blog posts articles
     */
    static async getBlogPosts(req, res, next) {
        try {
            const posts = await marketing_service_1.MarketingService.getBlogPosts();
            return response_1.ResponseHandler.success(res, posts);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get detailed blog post article
     */
    static async getBlogPostDetails(req, res, next) {
        try {
            const { id } = req.params;
            const post = await marketing_service_1.MarketingService.getBlogPostDetails(id);
            return response_1.ResponseHandler.success(res, post);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Check out billing plan subscription transaction
     */
    static async checkoutPaymentTransaction(req, res, next) {
        try {
            const userId = req.user?.id || "unknown";
            const result = await marketing_service_1.MarketingService.checkoutPaymentTransaction(userId, req.body);
            return response_1.ResponseHandler.success(res, result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MarketingController = MarketingController;
