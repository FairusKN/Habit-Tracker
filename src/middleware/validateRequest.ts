import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError, z } from "zod";
import { ValidationError } from "@/utils/errorHandler";

const validateRequest = (schema: ZodObject) => {
  return (req: Request, _: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError(z.prettifyError(error) || "Validation failed"));
        return;
      }
      next(new ValidationError("Invalid request data"));
    }
  };
};

export default validateRequest;
