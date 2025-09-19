import apiClient from './apiClient';

export const taskService = {
  // Get all tasks for a project
  async getTasksByProject(projectId) {
    try {
      const response = await apiClient.get(`/api/projects/${projectId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get task by ID
  async getTask(id) {
    try {
      const response = await apiClient.get(`/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Create new task
  async createTask(taskData) {
    try {
      const response = await apiClient.post('/api/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task
  async updateTask(id, taskData) {
    try {
      const response = await apiClient.put(`/api/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Update task status
  async updateTaskStatus(id, status) {
    try {
      const response = await apiClient.patch(`/api/tasks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },

  // Delete task
  async deleteTask(id) {
    try {
      const response = await apiClient.delete(`/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};
