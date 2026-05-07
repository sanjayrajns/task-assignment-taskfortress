import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';

// Assuming local dev server. For Android emulator: 10.0.2.2. For iOS: localhost.
// Replace with actual production URL later.
// Use your PC's local IP so Android devices can reach the backend over WiFi.
// localhost on a phone points to the phone itself — not your PC.
const API_URL = 'http://10.45.121.187:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Auto logout on 401 Unauthorized
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
