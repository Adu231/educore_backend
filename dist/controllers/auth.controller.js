"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const errors_1 = require("../utils/errors");
class AuthController {
    /**
     * Log in user
     */
    static async login(req, res, next) {
        try {
            const { email, password, role } = req.body;
            const result = await auth_service_1.AuthService.login(email, password, role);
            return response_1.ResponseHandler.success(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Register user
     */
    static async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;
            const result = await auth_service_1.AuthService.register(name, email, password, role);
            return response_1.ResponseHandler.success(res, result, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Forgot password request
     */
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const result = await auth_service_1.AuthService.forgotPassword(email);
            return response_1.ResponseHandler.success(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update profile details
     */
    static async updateProfile(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new errors_1.BadRequestError("User authentication context missing.");
            }
            const { name, phone, address, department, semester, profileCompleted } = req.body;
            const result = await auth_service_1.AuthService.updateProfile(userId, name, phone, address, department, semester, profileCompleted);
            return response_1.ResponseHandler.success(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Upload / update avatar image URL
     */
    static async updateAvatar(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new errors_1.BadRequestError("User authentication context missing.");
            }
            const { avatarUrl } = req.body;
            const result = await auth_service_1.AuthService.updateAvatar(userId, avatarUrl);
            return response_1.ResponseHandler.success(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Change user password
     */
    static async changePassword(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new errors_1.BadRequestError("User authentication context missing.");
            }
            const { oldPassword, newPassword } = req.body;
            const result = await auth_service_1.AuthService.changePassword(userId, oldPassword, newPassword);
            return response_1.ResponseHandler.success(res, result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
