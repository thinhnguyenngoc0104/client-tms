import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn } from 'lucide-react';
import './AuthButtons.css';

const LoginButton = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <button
      className="auth-button login-button"
      onClick={() => loginWithRedirect()}
      disabled={isLoading}
    >
      <LogIn size={18} />
      {isLoading ? 'Loading...' : 'Log In'}
    </button>
  );
};

export default LoginButton;
