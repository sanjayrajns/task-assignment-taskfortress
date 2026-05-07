import { Task, ITaskDocument } from './task.model';
import { PaginationQuery, PaginationMeta } from '../../common/utils';

export interface TaskFilters {
  assignedTo?: string;
  status?: string;
  createdBy?: string;
}

export interface PaginatedTasks {
  tasks: ITaskDocument[];
  meta: PaginationMeta;
}

/**
 * Data-access layer for Task collection.
 * All DB queries live here — no business logic.
 */
export class TaskRepository {
  async findAll(
    filters: TaskFilters,
    pagination: PaginationQuery
  ): Promise<PaginatedTasks> {
    const query = this.buildQuery(filters);

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignedTo', 'id name email role')
        .populate('createdBy', 'id name email')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      tasks,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNextPage: pagination.page < totalPages,
        hasPrevPage: pagination.page > 1,
      },
    };
  }

  async findById(id: string): Promise<ITaskDocument | null> {
    return Task.findById(id)
      .populate('assignedTo', 'id name email role')
      .populate('createdBy', 'id name email');
  }

  async create(data: {
    title: string;
    description: string;
    assignedTo: string;
    createdBy: string;
    status?: string;
    priority?: string;
    category?: string;
    dueDate?: Date | null;
    tags?: string[];
  }): Promise<ITaskDocument> {
    const task = await Task.create(data);
    return this.findById(task.id) as Promise<ITaskDocument>;
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      assignedTo?: string;
      priority?: string;
      category?: string;
      dueDate?: Date | null;
      tags?: string[];
    }
  ): Promise<ITaskDocument | null> {
    return Task.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'id name email role')
      .populate('createdBy', 'id name email');
  }

  async updateStatus(
    id: string,
    status: string
  ): Promise<ITaskDocument | null> {
    return Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'id name email role')
      .populate('createdBy', 'id name email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Task.findByIdAndDelete(id);
    return result !== null;
  }

  async findByIdAndAssignee(
    id: string,
    assignedTo: string
  ): Promise<ITaskDocument | null> {
    return Task.findOne({ _id: id, assignedTo });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await Task.countDocuments({ _id: id });
    return count > 0;
  }

  private buildQuery(filters: TaskFilters): Record<string, unknown> {
    const query: Record<string, unknown> = {};
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.createdBy) query.createdBy = filters.createdBy;
    if (filters.status) query.status = filters.status;
    return query;
  }
}

export const taskRepository = new TaskRepository();
