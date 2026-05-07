import { Request, Response, NextFunction } from 'express';
import { Role } from '../constants';
import { AppError } from '../errors';

/**
 * Factory that returns middleware restricting access to specified roles.
 * Must be placed AFTER authMiddleware in the middleware chain.
 *
 * @example router.post('/', authMiddleware, roleMiddleware(Role.ADMIN), controller.create)
 */
export const roleMiddleware = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden(
        `Access denied. Required role(s): ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};
