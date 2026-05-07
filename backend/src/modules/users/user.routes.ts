import { Router } from 'express';
import { userRepository } from './user.repository';
import { authMiddleware, roleMiddleware } from '../../common/middleware';
import { asyncHandler } from '../../common/utils';
import { Role } from '../../common/constants';
import { sendSuccess } from '../../common/utils';

const router = Router();

router.use(authMiddleware);

/**
 * GET /users
 * ADMIN only — list all registered users (for task assignment picker)
 */
router.get(
  '/',
  roleMiddleware(Role.ADMIN),
  asyncHandler(async (_req, res) => {
    const users = await userRepository.findAll();
    const sanitized = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    }));
    sendSuccess(res, 200, 'Users retrieved successfully', sanitized);
  })
);

export { router as userRoutes };
