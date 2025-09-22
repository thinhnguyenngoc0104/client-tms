import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, Shield } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { usePermissions } from '../hooks/usePermissions';
import './UserProfile.css';

const UserProfile = () => {
  const { user: auth0User } = useAuth0();
  const { state } = useApp();
  const { user } = state;
  const { getRoleDisplayName } = usePermissions();

  const displayUser = user || auth0User;

  if (!displayUser) return null;

  return (
    <div className="user-profile">
      <div className="user-avatar">
        {displayUser.pictureUrl ? (
          <img src={displayUser.pictureUrl} alt={displayUser.name} />
        ) : (
          <User size={20} />
        )}
      </div>
      <div className="user-info">
        <div className="user-name">
          {displayUser.name || displayUser.email}
          {displayUser.role === 'ADMIN' && (
            <span className="admin-badge">
              <Shield size={12} />
              Admin
            </span>
          )}
        </div>
        <div className="user-email">{displayUser.email}</div>
        {displayUser.role && (
          <div className="user-role">{getRoleDisplayName(displayUser.role)}</div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
