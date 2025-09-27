import apiClient from './apiClient';

export const authService = {
  // Get user profile from Auth0 token
  async syncProfile() {
    try {
      const response = await apiClient.post('/api/sync');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
};
