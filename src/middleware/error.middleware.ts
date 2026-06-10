import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";
import { env } from "../config/env";
import { ResponseHandler } from "../utils/response";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`Operational error: ${err.message}`, err);
    } else {
      logger.warn(`Operational warning: ${err.message}`);
    }
    return ResponseHandler.error(res, err.message, err.statusCode);
  }

  // Unexpected/Unhandled errors
  logger.error(`Unhandled exception: ${err.message}`, err);

  const errorMessage =
    env.NODE_ENV === "development"
      ? err.message
      : "An unexpected error occurred on the server.";

  return ResponseHandler.error(res, errorMessage, 500);
}
