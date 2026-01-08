/**
 * Date Helper Utilities
 */

import { format, formatDistance, isAfter, isBefore, addDays, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  if (!date) return 'No date';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM d, yyyy HH:mm');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(parsedDate, new Date(), { addSuffix: true });
  } catch (error) {
    return '';
  }
};

export const isOverdue = (deadline) => {
  if (!deadline) return false;
  try {
    const deadlineDate = typeof deadline === 'string' ? parseISO(deadline) : deadline;
    return isBefore(deadlineDate, new Date());
  } catch (error) {
    return false;
  }
};

export const daysUntil = (targetDate) => {
  if (!targetDate) return null;
  try {
    const target = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate;
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    return null;
  }
};

export const addDaysToDate = (date, days) => {
  try {
    const startDate = typeof date === 'string' ? parseISO(date) : date;
    return addDays(startDate, days);
  } catch (error) {
    return new Date();
  }
};

export const getDeadlineStatus = (deadline) => {
  const days = daysUntil(deadline);
  
  if (days === null) return { status: 'none', color: '#666666' };
  if (days < 0) return { status: 'overdue', color: '#ef4444', label: 'Overdue' };
  if (days === 0) return { status: 'today', color: '#f59e0b', label: 'Due today' };
  if (days <= 3) return { status: 'urgent', color: '#f59e0b', label: `${days}d left` };
  if (days <= 7) return { status: 'soon', color: '#3b82f6', label: `${days}d left` };
  return { status: 'normal', color: '#10b981', label: `${days}d left` };
};