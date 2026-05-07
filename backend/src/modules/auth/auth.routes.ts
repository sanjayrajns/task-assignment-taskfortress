import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../common/middleware';
import { asyncHandler } from '../../common/utils';
import { registerSchema, loginSchema } from './auth.dto';

const router = Router();

/**
 * POST /auth/register
 * Public — creates a new user account
 */
router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(authController.register)
);

/**
 * POST /auth/login
 * Public — authenticates and returns JWT
 */
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(authController.login)
);

export { router as authRoutes };
