import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import UserProfile from './UserProfile';
import LogoutButton from './LogoutButton';
import './Layout.css';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">TaskFlow</h1>
          </div>
          
          <div className="header-right">
            <UserProfile />
            <LogoutButton />
          </div>
        </div>
      </header>
      
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
