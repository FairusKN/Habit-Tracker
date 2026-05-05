import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "@/utils/appError";
import { ErrorCode } from "@/utils/errorCodes";
import { logger } from "@/config/logger";
import ENV from "@/config/env";

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError("No token provided", 401, ErrorCode.UNAUTHORIZED);
    }
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      logger.warn({
        message: "Invalid token",
        context: "AuthMiddleware.requireAuth",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new AppError(
        "Unauthorized - Invalid token",
        401,
        ErrorCode.INVALID_TOKEN
      );
    }
  } catch (error) {
    next(error);
  }
};
