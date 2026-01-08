/**
 * useProjects Hook
 * Manages project data and operations
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProjects();
      setProjects(response.projects || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (projectData) => {
    try {
      const response = await api.createProject(projectData);
      setProjects(prev => [...prev, response.project]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await api.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
  };
}

export function useProject(projectId) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProject(projectId);
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const updateProject = async (updates) => {
    try {
      const response = await api.updateProject(projectId, updates);
      setProject(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTaskStatus = async (taskId, status, notes = null) => {
    try {
      const response = await api.updateTaskStatus(projectId, {
        task_id: taskId,
        status,
        notes,
      });
      await fetchProject(); // Refresh project data
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const generateReport = async (reportType = 'weekly') => {
    try {
      return await api.generateReport(projectId, reportType);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    project,
    loading,
    error,
    fetchProject,
    updateProject,
    updateTaskStatus,
    generateReport,
  };
}