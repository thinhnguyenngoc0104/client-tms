import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogOut } from 'lucide-react';
import { useApp } from "../store/useApp";
import './AuthButtons.css';

const LogoutButton = () => {
  const { logout } = useAuth0();
  const { actions } = useApp();

  return (
    <button
      className="auth-button logout-button"
      onClick={() => {
        actions.stopImpersonation();
        localStorage.removeItem('impersonation_state');
        logout({
          logoutParams: {
            returnTo: window.location.origin
          }
        });
      }}
    >
      <LogOut size={18} />
      Log Out
    </button>
  );
};

export default LogoutButton;
