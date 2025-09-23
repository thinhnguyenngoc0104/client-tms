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
};
