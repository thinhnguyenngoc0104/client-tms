import React, { useReducer, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authService } from '../api/authService';
import { appReducer, initialState, ActionTypes } from "./appReducer";
import { createActions } from "./appActions";
import { AppContext } from "./AppContext";

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

          // Get ID Token
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
  const actions = createActions(dispatch, ActionTypes, state);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};


