"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
const response_1 = require("../utils/response");
function errorMiddleware(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    if (err instanceof errors_1.AppError) {
        if (err.statusCode >= 500) {
            logger_1.logger.error(`Operational error: ${err.message}`, err);
        }
        else {
            logger_1.logger.warn(`Operational warning: ${err.message}`);
        }
        return response_1.ResponseHandler.error(res, err.message, err.statusCode);
    }
    // Unexpected/Unhandled errors
    logger_1.logger.error(`Unhandled exception: ${err.message}`, err);
    const errorMessage = env_1.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred on the server.";
    return response_1.ResponseHandler.error(res, errorMessage, 500);
}
