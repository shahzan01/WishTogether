// middlewares/error.middleware.ts
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "@/utils/ApiError";

const errorMiddleware: ErrorRequestHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(err);
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    data: null,
  });
};

export { errorMiddleware };
