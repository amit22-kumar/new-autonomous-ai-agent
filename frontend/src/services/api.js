/**
 * API Service
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Projects
  async getProjects() {
    return this.request('/api/projects');
  }

  async getProject(projectId) {
    return this.request(`/api/projects/${projectId}`);
  }

  async createProject(projectData) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(projectId, updates) {
    return this.request(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(projectId) {
    return this.request(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Tasks
  async updateTaskStatus(projectId, taskUpdate) {
    return this.request(`/api/projects/${projectId}/tasks`, {
      method: 'PUT',
      body: JSON.stringify(taskUpdate),
    });
  }

  // Reports
  async generateReport(projectId, reportType = 'weekly') {
    return this.request(`/api/projects/${projectId}/report?type=${reportType}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/');
  }
}

export default new ApiService();