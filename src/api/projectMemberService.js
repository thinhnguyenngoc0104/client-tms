import apiClient from './apiClient';

export const projectMemberService = {
  // Get all members of a project
  async getProjectMembers(projectId) {
    try {
      const response = await apiClient.get(`/api/projects/${projectId}/members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project members:', error);
      throw error;
    }
  },

  // Add member to project (ADMIN only)
  async addProjectMember(projectId, userId) {
    try {
      const response = await apiClient.post(`/api/projects/${projectId}/members`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error adding project member:', error);
      throw error;
    }
  },

  // Remove member from project (ADMIN only)
  async removeProjectMember(projectId, userId) {
    try {
      const response = await apiClient.delete(`/api/projects/${projectId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing project member:', error);
      throw error;
    }
  }
};
