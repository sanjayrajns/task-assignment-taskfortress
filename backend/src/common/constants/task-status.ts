export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export const ALL_TASK_STATUSES = Object.values(TaskStatus);

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export const ALL_TASK_PRIORITIES = Object.values(TaskPriority);

export enum TaskCategory {
  DESIGN = 'DESIGN',
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  MARKETING = 'MARKETING',
  OPERATIONS = 'OPERATIONS',
  OTHER = 'OTHER',
}

export const ALL_TASK_CATEGORIES = Object.values(TaskCategory);
