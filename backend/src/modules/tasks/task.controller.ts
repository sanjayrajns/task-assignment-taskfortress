import { Request, Response } from 'express';
import { taskService } from './task.service';
import { sendSuccess } from '../../common/utils';
import { parsePagination } from '../../common/utils';

/**
 * Task controller — thin HTTP layer only.
 * Extracts params, delegates to TaskService, formats response.
 */
export class TaskController {
  async getTasks(req: Request, res: Response): Promise<void> {
    const pagination = parsePagination(req.query as { page?: string; limit?: string });
    const statusFilter = req.query.status as string | undefined;

    const result = await taskService.getTasks(req.user!, pagination, statusFilter);

    sendSuccess(res, 200, 'Tasks retrieved successfully', result.tasks, result.meta);
  }

  async createTask(req: Request, res: Response): Promise<void> {
    const task = await taskService.createTask(req.user!, req.body);
    sendSuccess(res, 201, 'Task created successfully', task);
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const task = await taskService.updateTask(req.user!, id, req.body);
    sendSuccess(res, 200, 'Task updated successfully', task);
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await taskService.deleteTask(req.user!, id);
    sendSuccess(res, 200, 'Task deleted successfully', null);
  }

  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const task = await taskService.updateTaskStatus(req.user!, id, req.body);
    sendSuccess(res, 200, 'Task status updated successfully', task);
  }
}

export const taskController = new TaskController();
