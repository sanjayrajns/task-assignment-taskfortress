import { z } from 'zod';
import {
  ALL_TASK_STATUSES, TaskStatus,
  ALL_TASK_PRIORITIES, TaskPriority,
  ALL_TASK_CATEGORIES, TaskCategory,
} from '../../common/constants';

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description cannot be empty')
    .max(2000, 'Description cannot exceed 2000 characters'),
  assignedTo: z
    .string({ required_error: 'assignedTo (user ID) is required' })
    .regex(/^[a-f\d]{24}$/i, 'assignedTo must be a valid MongoDB ObjectId'),
  status: z
    .enum(ALL_TASK_STATUSES as [string, ...string[]])
    .optional()
    .default(TaskStatus.PENDING),
  priority: z
    .enum(ALL_TASK_PRIORITIES as [string, ...string[]])
    .optional()
    .default(TaskPriority.MEDIUM),
  category: z
    .enum(ALL_TASK_CATEGORIES as [string, ...string[]])
    .optional()
    .default(TaskCategory.OTHER),
  dueDate: z
    .string()
    .datetime({ message: 'dueDate must be a valid ISO 8601 date string' })
    .optional()
    .nullable(),
  tags: z
    .array(z.string().trim().max(30))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([]),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  assignedTo: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'assignedTo must be a valid MongoDB ObjectId')
    .optional(),
  priority: z
    .enum(ALL_TASK_PRIORITIES as [string, ...string[]])
    .optional(),
  category: z
    .enum(ALL_TASK_CATEGORIES as [string, ...string[]])
    .optional(),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .nullable(),
  tags: z
    .array(z.string().trim().max(30))
    .max(10)
    .optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(ALL_TASK_STATUSES as [string, ...string[]], {
    required_error: 'Status is required',
    invalid_type_error: `Status must be one of: ${ALL_TASK_STATUSES.join(', ')}`,
  }),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusDto = z.infer<typeof updateTaskStatusSchema>;
