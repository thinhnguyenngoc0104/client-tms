import apiClient from './apiClient';

export const projectService = {
  // Get all projects
  async getProjects() {
    try {
      const response = await apiClient.get('/api/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get project by ID
  async getProject(id) {
    try {
      const response = await apiClient.get(`/api/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  // Create new project
  async createProject(projectData) {
    try {
      const response = await apiClient.post('/api/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  async updateProject(id, projectData) {
    try {
      const response = await apiClient.put(`/api/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  async deleteProject(id) {
    try {
      const response = await apiClient.delete(`/api/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
};
