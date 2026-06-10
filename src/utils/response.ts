import { Response } from "express";

export const ResponseHandler = {
  /**
   * Send a successful JSON response
   */
  success<T>(res: Response, data: T, statusCode = 200): Response {
    return res.status(statusCode).json(data);
  },

  /**
   * Send an error JSON response
   */
  error(res: Response, message: string, statusCode = 500): Response {
    return res.status(statusCode).json({ error: message });
  }
};
