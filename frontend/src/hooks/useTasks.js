import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      setTasks([data, ...tasks]);
      return data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to create task';
    }
  }, [tasks]);

  const updateTask = useCallback(async (id, taskData) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      setTasks(tasks.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to update task';
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      throw err.response?.data?.error || 'Failed to delete task';
    }
  }, [tasks]);

  return {
    tasks,
    setTasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
