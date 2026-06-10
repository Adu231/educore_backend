import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "student" | "admin";
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Access denied. No token provided."));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      role: "student" | "admin";
    };
    req.user = decoded;
    next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid token."));
  }
}

export function roleGuard(roles: Array<"student" | "admin">) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError("Forbidden. Insufficient permissions."));
    }
    next();
  };
}
