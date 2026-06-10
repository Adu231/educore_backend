import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import apiRoutes from "./routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { logger } from "./utils/logger";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const app = express();

// Configure middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Raw OpenAPI JSON Route
app.get("/api-docs-json", (req, res) => {
  res.json(swaggerDocument);
});

// Mount API routes (with and without prefix for compatibility)
app.use("/api", apiRoutes);
app.use("/", apiRoutes);
app.use("/", authRoutes);
app.use("/", profileRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "EduCore Backend API Server is active." });
});

// Global Error Handler Middleware (MUST be defined last)
app.use(errorMiddleware);

// Connect to MongoDB & Start Server
connectDB().then(() => {
  app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
  });
});
