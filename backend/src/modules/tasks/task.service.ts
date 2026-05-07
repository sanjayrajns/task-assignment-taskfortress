import { AppError } from '../../common/errors';
import { Role } from '../../common/constants';
import { JwtPayload } from '../../common/middleware';
import { PaginationQuery } from '../../common/utils';
import { userRepository } from '../users';
import { taskRepository, PaginatedTasks } from './task.repository';
import { ITaskDocument } from './task.model';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto } from './task.dto';

/**
 * Task service — all business logic, role checks, and policy enforcement.
 * This is the authoritative layer; nothing bypasses it.
 */
export class TaskService {
  /**
   * GET /tasks
   * - ADMIN: retrieves all tasks (filterable by status)
   * - USER: retrieves only their assigned tasks
   */
  async getTasks(
    requestingUser: JwtPayload,
    pagination: PaginationQuery,
    statusFilter?: string
  ): Promise<PaginatedTasks> {
    const filters =
      requestingUser.role === Role.ADMIN
        ? { ...(statusFilter && { status: statusFilter }) }
        : { assignedTo: requestingUser.userId, ...(statusFilter && { status: statusFilter }) };

    return taskRepository.findAll(filters, pagination);
  }

  /**
   * POST /tasks (ADMIN only)
   * - Validates assignedTo user exists
   * - Creates task with creator attribution and all new fields
   */
  async createTask(
    requestingUser: JwtPayload,
    dto: CreateTaskDto
  ): Promise<ITaskDocument> {
    if (requestingUser.role !== Role.ADMIN) {
      throw AppError.forbidden('Only administrators can create tasks');
    }

    const assignee = await userRepository.findById(dto.assignedTo);
    if (!assignee) {
      throw AppError.notFound(`User with ID ${dto.assignedTo} not found`);
    }

    const task = await taskRepository.create({
      title: dto.title,
      description: dto.description,
      assignedTo: dto.assignedTo,
      createdBy: requestingUser.userId,
      status: dto.status,
      priority: dto.priority,
      category: dto.category,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      tags: dto.tags,
    });

    return task;
  }

  /**
   * PUT /tasks/:id (ADMIN only)
   * - Updates any field except status and creator attribution
   */
  async updateTask(
    requestingUser: JwtPayload,
    taskId: string,
    dto: UpdateTaskDto
  ): Promise<ITaskDocument> {
    if (requestingUser.role !== Role.ADMIN) {
      throw AppError.forbidden('Only administrators can edit tasks');
    }

    const existing = await taskRepository.findById(taskId);
    if (!existing) {
      throw AppError.notFound(`Task with ID ${taskId} not found`);
    }

    // If reassigning, verify new assignee exists
    if (dto.assignedTo) {
      const assignee = await userRepository.findById(dto.assignedTo);
      if (!assignee) {
        throw AppError.notFound(`User with ID ${dto.assignedTo} not found`);
      }
    }

    const updated = await taskRepository.update(taskId, {
      ...(dto.title && { title: dto.title }),
      ...(dto.description && { description: dto.description }),
      ...(dto.assignedTo && { assignedTo: dto.assignedTo }),
      ...(dto.priority && { priority: dto.priority }),
      ...(dto.category && { category: dto.category }),
      ...(dto.dueDate !== undefined && { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }),
      ...(dto.tags !== undefined && { tags: dto.tags }),
    });

    if (!updated) {
      throw AppError.internal('Failed to update task');
    }

    return updated;
  }

  /**
   * DELETE /tasks/:id (ADMIN only)
   */
  async deleteTask(
    requestingUser: JwtPayload,
    taskId: string
  ): Promise<void> {
    if (requestingUser.role !== Role.ADMIN) {
      throw AppError.forbidden('Only administrators can delete tasks');
    }

    const exists = await taskRepository.existsById(taskId);
    if (!exists) {
      throw AppError.notFound(`Task with ID ${taskId} not found`);
    }

    const deleted = await taskRepository.delete(taskId);
    if (!deleted) {
      throw AppError.internal('Failed to delete task');
    }
  }

  /**
   * PATCH /tasks/:id
   * - ADMIN: can update any task status
   * - USER: can only update tasks assigned to them
   */
  async updateTaskStatus(
    requestingUser: JwtPayload,
    taskId: string,
    dto: UpdateTaskStatusDto
  ): Promise<ITaskDocument> {
    let task: ITaskDocument | null;

    if (requestingUser.role === Role.ADMIN) {
      task = await taskRepository.findById(taskId);
      if (!task) {
        throw AppError.notFound(`Task with ID ${taskId} not found`);
      }
    } else {
      task = await taskRepository.findByIdAndAssignee(taskId, requestingUser.userId);
      if (!task) {
        throw AppError.notFound(`Task with ID ${taskId} not found`);
      }
    }

    const updated = await taskRepository.updateStatus(taskId, dto.status);
    if (!updated) {
      throw AppError.internal('Failed to update task status');
    }

    return updated;
  }
}

export const taskService = new TaskService();
