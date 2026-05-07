import { Router } from 'express';
import { taskController } from './task.controller';
import { authMiddleware, roleMiddleware, validate } from '../../common/middleware';
import { asyncHandler } from '../../common/utils';
import { Role } from '../../common/constants';
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from './task.dto';

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

/**
 * GET /tasks
 * ADMIN: all tasks (paginated, filterable by ?status=)
 * USER:  only their assigned tasks
 */
router.get('/', asyncHandler(taskController.getTasks));

/**
 * POST /tasks
 * ADMIN only — create a new task
 */
router.post(
  '/',
  roleMiddleware(Role.ADMIN),
  validate(createTaskSchema),
  asyncHandler(taskController.createTask)
);

/**
 * PUT /tasks/:id
 * ADMIN only — update task details (title, description, priority, etc.)
 */
router.put(
  '/:id',
  roleMiddleware(Role.ADMIN),
  validate(updateTaskSchema),
  asyncHandler(taskController.updateTask)
);

/**
 * DELETE /tasks/:id
 * ADMIN only — permanently delete a task
 */
router.delete(
  '/:id',
  roleMiddleware(Role.ADMIN),
  asyncHandler(taskController.deleteTask)
);

/**
 * PATCH /tasks/:id
 * Authenticated — update task status only
 * Service layer enforces USER can only update own tasks
 */
router.patch(
  '/:id',
  validate(updateTaskStatusSchema),
  asyncHandler(taskController.updateTaskStatus)
);

export { router as taskRoutes };
