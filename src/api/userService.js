import apiClient from './apiClient';

export const userService = {
  // Get all users
  async getUsers() {
    try {
      const response = await apiClient.get('/api/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUser(id) {
    try {
      const response = await apiClient.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};
