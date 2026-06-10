"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./utils/logger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const app = (0, express_1.default)();
// Configure middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Swagger Documentation Route
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// Raw OpenAPI JSON Route
app.get("/api-docs-json", (req, res) => {
    res.json(swagger_json_1.default);
});
// Mount API routes (with and without prefix for compatibility)
app.use("/api", routes_1.default);
app.use("/", routes_1.default);
app.use("/", auth_routes_1.default);
app.use("/", profile_routes_1.default);
// Root Endpoint
app.get("/", (req, res) => {
    res.json({ message: "EduCore Backend API Server is active." });
});
// Global Error Handler Middleware (MUST be defined last)
app.use(error_middleware_1.errorMiddleware);
// Connect to MongoDB & Start Server
(0, db_1.connectDB)().then(() => {
    app.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`Server is running on port ${env_1.env.PORT} in ${env_1.env.NODE_ENV} mode.`);
    });
});
