import { api } from './api';
import { User } from '../types';

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data.data as User[];
  },
};
