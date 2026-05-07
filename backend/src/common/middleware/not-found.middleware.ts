import { Request, Response } from 'express';
import { sendError } from '../utils';

/**
 * Catch-all for undefined routes. Must be placed after all valid route registrations.
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};
