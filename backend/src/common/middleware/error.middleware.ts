import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { sendError } from '../utils';
import { env } from '../../config/env.config';
import mongoose from 'mongoose';

/**
 * Centralized error handler — must be registered LAST in the middleware chain.
 * Normalizes all error types into consistent API responses.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log all errors in development
  if (env.nodeEnv === 'development') {
    console.error('❌ Error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  // Known operational errors
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const formattedErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    sendError(res, 400, 'Validation failed', formattedErrors);
    return;
  }

  // Mongoose duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    sendError(res, 409, `Duplicate value for field: ${field}`);
    return;
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err instanceof mongoose.Error.CastError) {
    sendError(res, 400, `Invalid value for ${err.path}: ${err.value}`);
    return;
  }

  // JWT errors (caught here as a safety net)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    sendError(res, 401, 'Invalid or expired token');
    return;
  }

  // Unexpected errors — never leak internals in production
  const message =
    env.nodeEnv === 'development'
      ? err.message
      : 'An unexpected error occurred';

  sendError(res, 500, message);
};
