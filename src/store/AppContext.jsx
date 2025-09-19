import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authService } from '../api/authService';
import { projectService } from '../api/projectService';
import { taskService } from '../api/taskService';
import { userService } from '../api/userService';
import { projectMemberService } from '../api/projectMemberService';

// Initial state
const initialState = {
  user: null,
  users: [],
  projects: [],
  tasks: [],
  currentProject: null,
  loading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_USERS: 'SET_USERS',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_TASKS: 'SET_TASKS',
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  CLEAR_STATE: 'CLEAR_STATE',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    case ActionTypes.SET_USERS:
      return { ...state, users: action.payload };
    case ActionTypes.SET_PROJECTS:
      return { ...state, projects: action.payload };
    case ActionTypes.SET_TASKS:
      return { ...state, tasks: action.payload };
    case ActionTypes.SET_CURRENT_PROJECT:
      return { ...state, currentProject: action.payload };
    case ActionTypes.ADD_PROJECT:
      return { ...state, projects: [...state.projects, action.payload] };
    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject: state.currentProject?.id === action.payload.id
          ? action.payload
          : state.currentProject
      };
    case ActionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload
          ? null
          : state.currentProject
      };
    case ActionTypes.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      };
    case ActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload)
      };
    case ActionTypes.CLEAR_STATE:
      return initialState;
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { getAccessTokenSilently, getIdTokenClaims, isAuthenticated, user: auth0User } = useAuth0();

  // Initialize auth token when user is authenticated
  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated && auth0User) {
        try {
          const token = await getAccessTokenSilently();
          // authService.setAuthToken(token);
          localStorage.setItem('auth_token', token);

          // Lấy ID Token
          const idTokenClaims = await getIdTokenClaims();

          // Fetch user profile from backend
          const userProfile = await authService.getProfile(idTokenClaims.__raw);
          dispatch({ type: ActionTypes.SET_USER, payload: userProfile });

          // Store user role for easy access
          localStorage.setItem('user_role', userProfile.role);
        } catch (error) {
          console.error('Error initializing auth:', error);
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        }
      }
    };

    initializeAuth();
  }, [isAuthenticated, auth0User, getAccessTokenSilently, getIdTokenClaims]);

  // Actions
  const actions = {
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

    // Project Members actions
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
    isAdmin: () => {
      return state.user?.role === 'ADMIN';
    },

    canManageProjects: () => {
      return state.user?.role === 'ADMIN';
    },

    canManageProjectMembers: () => {
      return state.user?.role === 'ADMIN';
    },

    canUpdateTask: (task) => {
      // Admin can update any task, regular users can only update their own tasks
      if (!task || !state.user) return false;
      // Check both assignee_id and assigneeId for compatibility
      const taskAssigneeId = task.assignee_id || task.assigneeId;
      return state.user.role === 'ADMIN' || taskAssigneeId === state.user.id;
    },

    canDeleteTask: (task) => {
      // Admin can delete any task, regular users can only delete their own tasks
      if (!task || !state.user) return false;
      // Check both assignee_id and assigneeId for compatibility
      const taskAssigneeId = task.assignee_id || task.assigneeId;
      return state.user.role === 'ADMIN' || taskAssigneeId === state.user.id;
    },
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
