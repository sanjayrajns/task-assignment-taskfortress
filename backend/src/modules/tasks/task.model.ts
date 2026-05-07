import mongoose, { Schema, Document } from 'mongoose';
import { TaskStatus, ALL_TASK_STATUSES, TaskPriority, ALL_TASK_PRIORITIES, TaskCategory, ALL_TASK_CATEGORIES } from '../../common/constants';

export interface ITask {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: Date;
  tags: string[];
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

export interface ITaskDocument extends ITask, Document {
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ALL_TASK_STATUSES,
        message: `Status must be one of: ${ALL_TASK_STATUSES.join(', ')}`,
      },
      default: TaskStatus.PENDING,
    },
    priority: {
      type: String,
      enum: {
        values: ALL_TASK_PRIORITIES,
        message: `Priority must be one of: ${ALL_TASK_PRIORITIES.join(', ')}`,
      },
      default: TaskPriority.MEDIUM,
    },
    category: {
      type: String,
      enum: {
        values: ALL_TASK_CATEGORIES,
        message: `Category must be one of: ${ALL_TASK_CATEGORIES.join(', ')}`,
      },
      default: TaskCategory.OTHER,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must be assigned to a user'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must have a creator'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Composite index for user task queries + status filtering (required by spec)
taskSchema.index({ assignedTo: 1, status: 1 });
// Index for admin queries filtering by creator
taskSchema.index({ createdBy: 1 });

export const Task = mongoose.model<ITaskDocument>('Task', taskSchema);
