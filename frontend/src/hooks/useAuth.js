import { useCallback } from 'react';
import api from '../utils/api';

export const useAuth = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const register = useCallback(async (email, password, name) => {
    try {
      const { data } = await api.post('/auth/register', { email, password, name });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error.response?.data?.error || 'Registration failed';
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error.response?.data?.error || 'Login failed';
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  return { user, token, register, login, logout, isAuthenticated: !!token };
};
