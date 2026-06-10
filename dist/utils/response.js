"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
exports.ResponseHandler = {
    /**
     * Send a successful JSON response
     */
    success(res, data, statusCode = 200) {
        return res.status(statusCode).json(data);
    },
    /**
     * Send an error JSON response
     */
    error(res, message, statusCode = 500) {
        return res.status(statusCode).json({ error: message });
    }
};
