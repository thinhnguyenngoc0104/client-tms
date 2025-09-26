// src/store/appActions.js
import { userService } from "../api/userService";
import { projectService } from "../api/projectService";
import { taskService } from "../api/taskService";
import { projectMemberService } from "../api/projectMemberService";
import { impersonationService } from "../api/impersonationService";

export const createActions = (dispatch, ActionTypes, state) => ({
  setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
  setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
  clearError: () => dispatch({ type: ActionTypes.SET_ERROR, payload: null }),

  // User actions
  async fetchUsers() {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const users = await userService.getUsers();
      dispatch({ type: ActionTypes.SET_USERS, payload: users });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  },

  // Project actions
  async fetchProjects() {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const projects = await projectService.getProjects();
      dispatch({ type: ActionTypes.SET_PROJECTS, payload: projects });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  },

  async createProject(projectData) {
    try {
      const newProject = await projectService.createProject(projectData);
      dispatch({ type: ActionTypes.ADD_PROJECT, payload: newProject });
      return newProject;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  async updateProject(projectId, projectData) {
    try {
      const updatedProject = await projectService.updateProject(projectId, projectData);
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: updatedProject });
      return updatedProject;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  async deleteProject(id) {
    try {
      await projectService.deleteProject(id);
      dispatch({ type: ActionTypes.DELETE_PROJECT, payload: id });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  setCurrentProject: (project) => {
    dispatch({ type: ActionTypes.SET_CURRENT_PROJECT, payload: project });
  },

  // Task actions
  async fetchTasksByProject(projectId) {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const tasks = await taskService.getTasksByProject(projectId);
      dispatch({ type: ActionTypes.SET_TASKS, payload: tasks });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  },

  setTasks: (tasks) => dispatch({ type: ActionTypes.SET_TASKS, payload: tasks }),

  async createTask(taskData) {
    try {
      const newTask = await taskService.createTask(taskData);
      dispatch({ type: ActionTypes.ADD_TASK, payload: newTask });
      return newTask;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  async updateTask(id, taskData) {
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      dispatch({ type: ActionTypes.UPDATE_TASK, payload: updatedTask });
      return updatedTask;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  async updateTaskStatus(id, status) {
    try {
      const updatedTask = await taskService.updateTaskStatus(id, status);
      dispatch({ type: ActionTypes.UPDATE_TASK, payload: updatedTask });
      return updatedTask;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  async deleteTask(id) {
    try {
      await taskService.deleteTask(id);
      dispatch({ type: ActionTypes.DELETE_TASK, payload: id });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  clearState: () => dispatch({ type: ActionTypes.CLEAR_STATE }),

  async fetchProjectMembers(projectId) {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const members = await projectMemberService.getProjectMembers(projectId);
      return members;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  },

  async addProjectMember(projectId, userId) {
    try {
      const member = await projectMemberService.addProjectMember(projectId, userId);
      return member;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  async removeProjectMember(projectId, userId) {
    try {
      await projectMemberService.removeProjectMember(projectId, userId);
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  },

  // Helper functions
  isAdmin: () => state.user?.role === "ADMIN",

  canManageProjects: () => state.user?.role === "ADMIN",

  canManageProjectMembers: () => state.user?.role === "ADMIN",

  canUpdateTask: (task) => {
    if (!task || !state.user) return false;
    const taskAssigneeId = task.assignee_id || task.assigneeId;
    return state.user.role === "ADMIN" || taskAssigneeId === state.user.id;
  },

  canDeleteTask: (task) => {
    if (!task || !state.user) return false;
    const taskAssigneeId = task.assignee_id || task.assigneeId;
    return state.user.role === "ADMIN" || taskAssigneeId === state.user.id;
  },

  // Impersonation actions
  async startImpersonation(userId) {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const impersonatedUser = await impersonationService.getUserForImpersonation(userId);
      await impersonationService.startImpersonation(userId);
      dispatch({ type: ActionTypes.START_IMPERSONATION, payload: impersonatedUser });

      console.log('Saving');
      localStorage.setItem('impersonation_state', JSON.stringify({
        originalUser: state.user,
        impersonatedUser: impersonatedUser
      }));

      // Refresh projects for the impersonated user
      try {
        const projects = await projectService.getProjects();
        dispatch({ type: ActionTypes.SET_PROJECTS, payload: projects });
      } catch (projectError) {
        console.error('Error refreshing projects after impersonation:', projectError);
      }
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  },

  async stopImpersonation() {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      await impersonationService.stopImpersonation();

      // Get the original user before stopping impersonation
      const originalUser = state.originalUser;

      dispatch({ type: ActionTypes.STOP_IMPERSONATION });

      // If we have the original user data, make sure it's properly set
      if (originalUser) {
        dispatch({ type: ActionTypes.SET_USER, payload: originalUser });
      }

      // Clear impersonation state from localStorage
      localStorage.removeItem('impersonation_state');

      // Refresh projects for the original user
      try {
        const projects = await projectService.getProjects();
        dispatch({ type: ActionTypes.SET_PROJECTS, payload: projects });
      } catch (projectError) {
        console.error('Error refreshing projects after stopping impersonation:', projectError);
      }

      // Refresh users list to ensure users column is updated
      try {
        const users = await userService.getUsers();
        dispatch({ type: ActionTypes.SET_USERS, payload: users });
      } catch (usersError) {
        console.error('Error refreshing users after stopping impersonation:', usersError);
      }
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  },

  // Helper to check if currently impersonating
  isImpersonating: () => state.isImpersonating,

  // Helper to get original user (admin who started impersonation)
  getOriginalUser: () => state.originalUser,

  // Helper to get impersonated user
  getImpersonatedUser: () => state.impersonatedUser,
});
