export const initialState = {
  user: null,
  users: [],
  projects: [],
  tasks: [],
  currentProject: null,
  loading: false,
  error: null,
};

export const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_USER: "SET_USER",
  SET_USERS: "SET_USERS",
  SET_PROJECTS: "SET_PROJECTS",
  SET_TASKS: "SET_TASKS",
  SET_CURRENT_PROJECT: "SET_CURRENT_PROJECT",
  ADD_PROJECT: "ADD_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
  ADD_TASK: "ADD_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  CLEAR_STATE: "CLEAR_STATE",
};

export const appReducer = (state, action) => {
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
          : state.currentProject,
      };
    case ActionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload
          ? null
          : state.currentProject,
      };
    case ActionTypes.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case ActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      };
    case ActionTypes.START_IMPERSONATION: {
      // Ensure we have the complete original user data
      const originalUser = state.originalUser || state.user;
      const newState = {
        ...state,
        isImpersonating: true,
        originalUser: originalUser,
        impersonatedUser: action.payload,
        user: action.payload, // Switch current user to impersonated user
      };

      return newState;
    }
    case ActionTypes.STOP_IMPERSONATION: {
      const newState = {
        ...state,
        isImpersonating: false,
        user: state.originalUser, // Restore original user
        originalUser: null,
        impersonatedUser: null,
      };
      return newState;
    }
    case ActionTypes.CLEAR_STATE:
      return initialState;
    default:
      return state;
  }
};
