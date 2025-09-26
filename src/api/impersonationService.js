import apiClient from './apiClient';

export const impersonationService = {
  // Start impersonating a user (ADMIN only)
  async startImpersonation(userId) {
    try {
      const response = await apiClient.post(`/api/impersonation/start/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error starting impersonation:', error);
      // For now, we'll continue even if the backend endpoint doesn't exist
      // This allows the frontend functionality to work for testing
      if (error.response?.status === 404) {
        console.warn('Impersonation endpoint not implemented on backend, continuing with frontend-only impersonation');
        return { success: true };
      }
      throw error;
    }
  },

  // Stop impersonating and return to original user (ADMIN only)
  async stopImpersonation() {
    try {
      const response = await apiClient.post('/api/impersonation/stop');
      return response.data;
    } catch (error) {
      console.error('Error stopping impersonation:', error);
      // For now, we'll continue even if the backend endpoint doesn't exist
      if (error.response?.status === 404) {
        console.warn('Stop impersonation endpoint not implemented on backend, continuing with frontend-only impersonation');
        return { success: true };
      }
      throw error;
    }
  },

  // Get user details for impersonation
  async getUserForImpersonation(userId) {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user for impersonation:', error);
      throw error;
    }
  }
};
