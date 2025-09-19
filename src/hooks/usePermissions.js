import { useApp } from '../store/AppContext';

export const usePermissions = () => {
  const { state, actions } = useApp();
  const { user } = state;

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const canCreateProject = () => {
    return isAdmin();
  };

  const canUpdateProject = () => {
    return isAdmin();
  };

  const canDeleteProject = () => {
    return isAdmin();
  };

  const canManageProjectMembers = () => {
    return isAdmin();
  };

  const canCreateTask = (projectId) => {
    // Admin can create tasks in any project
    // Regular users can only create tasks in projects they are members of
    return isAdmin() || isProjectMember(projectId);
  };

  const canUpdateTask = (projectId) => {
    return isAdmin() || isProjectMember(projectId);
  };

  const canDeleteTask = (projectId) => {
    return isAdmin() || isProjectMember(projectId);
  };

  const canViewProject = (projectId) => {
    // Admin can view all projects
    // Regular users can only view projects they are members of
    return isAdmin() || isProjectMember(projectId);
  };

  const isProjectMember = (projectId) => {
    // This would need to be implemented based on your project membership data
    // For now, we'll assume regular users can access projects they're assigned tasks in
    // In a real implementation, you'd check against project membership data
    return true; // Placeholder - implement based on your membership logic
  };

  const getUserRole = () => {
    return user?.role || 'USER';
  };

  const getRoleDisplayName = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'Administrator';
      case 'USER':
        return 'User';
      default:
        return 'User';
    }
  };

  return {
    isAdmin,
    canCreateProject,
    canUpdateProject,
    canDeleteProject,
    canManageProjectMembers,
    canCreateTask,
    canUpdateTask,
    canDeleteTask,
    canViewProject,
    isProjectMember,
    getUserRole,
    getRoleDisplayName,
    user
  };
};
