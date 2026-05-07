import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../errors';

/**
 * Generic Zod validation middleware factory.
 * Validates req.body against the provided schema and replaces
 * it with the parsed (sanitized) output.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        throw AppError.badRequest('Validation failed', formattedErrors);
      }
      next(error);
    }
  };
};
