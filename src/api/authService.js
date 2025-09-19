import apiClient from './apiClient';

export const authService = {
  // Get user profile from Auth0 token
  async getProfile(idToken) {
    try {
      const response = await apiClient.get('/api/auth/profile', {
        headers: {
          'X-ID-Token': idToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
};
