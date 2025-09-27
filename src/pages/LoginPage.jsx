import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../components/LoginButton';
import Loading from '../components/Loading';
import './LoginPage.css';

const LoginPage = () => {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return <Loading message="Initializing..." />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>TaskFlow</h1>
          <p>Your project management solution</p>
        </div>
        
        <div className="login-content">
          <h2>Welcome</h2>
          <p>Sign in to access your projects and manage tasks efficiently.</p>
          
          {error && (
            <div className="error-message">
              <p>Authentication error: {error.message}</p>
            </div>
          )}
          
          <div className="login-actions">
            <LoginButton />
          </div>
        </div>
        
        <div className="login-footer">
          <p>Secure authentication powered by Auth0</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
