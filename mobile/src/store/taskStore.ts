import { create } from 'zustand';
import { Task, TaskStatus } from '../types';
import { api } from '../services/api';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (status?: TaskStatus) => Promise<void>;
  createTask: (data: {
    title: string;
    description: string;
    assignedTo: string;
    priority?: string;
    category?: string;
    dueDate?: string | null;
    tags?: string[];
  }) => Promise<void>;
  updateTask: (id: string, data: {
    title?: string;
    description?: string;
    assignedTo?: string;
    priority?: string;
    category?: string;
    dueDate?: string | null;
    tags?: string[];
  }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const params = status ? { status } : {};
      const response = await api.get('/tasks', { params });
      const tasks: Task[] = response.data.data.map((t: any) => ({
        id: t.id || t._id,
        title: t.title,
        description: t.description ?? '',
        status: t.status,
        priority: t.priority ?? 'MEDIUM',
        category: t.category ?? 'OTHER',
        dueDate: t.dueDate ?? null,
        tags: t.tags ?? [],
        assignedTo: t.assignedTo,
        createdBy: t.createdBy,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      }));
      set({ tasks, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch tasks',
        isLoading: false,
      });
    }
  },

  createTask: async (data) => {
    try {
      const response = await api.post('/tasks', data);
      const t = response.data.data;
      
      // Ensure the new task has the same structure as fetched tasks
      const newTask: Task = {
        id: t.id || t._id,
        title: t.title,
        description: t.description ?? '',
        status: t.status,
        priority: t.priority ?? 'MEDIUM',
        category: t.category ?? 'OTHER',
        dueDate: t.dueDate ?? null,
        tags: t.tags ?? [],
        assignedTo: t.assignedTo,
        createdBy: t.createdBy,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      };
      
      set({ tasks: [newTask, ...get().tasks] });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  updateTask: async (id, data) => {
    try {
      const response = await api.put(`/tasks/${id}`, data);
      const updated: Task = response.data.data;
      set({
        tasks: get().tasks.map((t) => (t.id === id ? updated : t)),
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  deleteTask: async (id) => {
    const previous = get().tasks;
    // Optimistic removal
    set({ tasks: previous.filter((t) => t.id !== id) });
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error: any) {
      set({ tasks: previous });
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },

  updateTaskStatus: async (id, status) => {
    const previousTasks = get().tasks;
    set({
      tasks: previousTasks.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
      ),
    });
    try {
      await api.patch(`/tasks/${id}`, { status });
    } catch (error: any) {
      set({ tasks: previousTasks });
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },
}));
