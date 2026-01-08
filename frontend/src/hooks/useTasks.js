/**
 * useTasks Hook
 * Manages task data and operations
 */

import { useState, useCallback } from 'react';

export function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTaskStatus = useCallback(async (taskId, newStatus, notes = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update local state optimistically
      setTasks(prev => prev.map(task => 
        task.task_id === taskId 
          ? { ...task, status: newStatus, notes }
          : task
      ));
      
      // Here you would call the API
      // await api.updateTaskStatus(projectId, taskId, newStatus, notes);
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const filterTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const filterTasksByPriority = useCallback((priority) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);

  const sortTasksByDeadline = useCallback(() => {
    return [...tasks].sort((a, b) => 
      new Date(a.deadline) - new Date(b.deadline)
    );
  }, [tasks]);

  return {
    tasks,
    setTasks,
    loading,
    error,
    updateTaskStatus,
    filterTasksByStatus,
    filterTasksByPriority,
    sortTasksByDeadline,
  };
}