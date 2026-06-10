import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

export async function connectDB(): Promise<typeof mongoose> {
  logger.info("Connecting to MongoDB database...");
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    logger.info(`Connected to MongoDB successfully! Host: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    logger.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
}
