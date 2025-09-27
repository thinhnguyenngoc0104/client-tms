import React, { useReducer, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authService } from '../api/authService';
import { appReducer, initialState, ActionTypes } from "./appReducer";
import { createActions } from "./appActions";
import { AppContext } from "./AppContext";
import { jwtDecode } from "jwt-decode";

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

          // Sync user to BE
          const userId = await authService.syncProfile();
          const decoded = jwtDecode(idTokenClaims.__raw);

          const userProfile = {
            id: userId,
            pictureUrl: decoded.picture,
            name: decoded.name,
            role: decoded["https://tms-api/roles"]?.[0] || "USER",
            email: decoded.email,
          };

          // Check if there's a saved impersonation state
          const savedImpersonationState = localStorage.getItem('impersonation_state');
          if (savedImpersonationState) {
            try {
              const impersonationData = JSON.parse(savedImpersonationState);
              // Verify the original user matches the current authenticated user
              if (impersonationData.originalUser?.id === userId) {
                // Set the original user first
                dispatch({ type: ActionTypes.SET_USER, payload: userProfile });

                // Then start impersonation (this will handle localStorage update)
                dispatch({
                  type: ActionTypes.START_IMPERSONATION,
                  payload: impersonationData.impersonatedUser
                });
              } else {
                // Clear invalid impersonation state
                localStorage.removeItem('impersonation_state');
                dispatch({ type: ActionTypes.SET_USER, payload: userProfile });
              }
            } catch (error) {
              console.error('Error restoring impersonation state:', error);
              localStorage.removeItem('impersonation_state');
              dispatch({ type: ActionTypes.SET_USER, payload: userProfile });
            }
          } else {
            dispatch({ type: ActionTypes.SET_USER, payload: userProfile });
          }

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


