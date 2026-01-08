/**
 * Task Helper Utilities
 */

export const getStatusColor = (status) => {
  const colors = {
    not_started: '#666666',
    in_progress: '#3b82f6',
    completed: '#10b981',
    blocked: '#ef4444',
    at_risk: '#f59e0b',
  };
  return colors[status] || '#666666';
};

export const getStatusLabel = (status) => {
  const labels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
    blocked: 'Blocked',
    at_risk: 'At Risk',
  };
  return labels[status] || status;
};

export const getPriorityColor = (priority) => {
  const colors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#a0a0a0',
  };
  return colors[priority] || '#a0a0a0';
};

export const getPriorityLabel = (priority) => {
  const labels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return labels[priority] || priority;
};

export const groupTasksByStatus = (tasks) => {
  return {
    not_started: tasks.filter(t => t.status === 'not_started'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
    blocked: tasks.filter(t => t.status === 'blocked'),
    at_risk: tasks.filter(t => t.status === 'at_risk'),
  };
};

export const calculateTaskProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
};

export const getTasksByPriority = (tasks, priority) => {
  return tasks.filter(t => t.priority === priority);
};

export const sortTasksByDeadline = (tasks) => {
  return [...tasks].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });
};

export const sortTasksByPriority = (tasks) => {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  return [...tasks].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};