import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, Shield } from 'lucide-react';
import { useApp } from "../store/useApp";
import './UserProfile.css';

const UserProfile = () => {
  const { user: auth0User } = useAuth0();
  const { state, actions } = useApp();
  const { user } = state;
  const isImpersonating = actions.isImpersonating();
  const originalUser = actions.getOriginalUser();

  // When impersonating, show the original user (admin) in the profile
  // When not impersonating, show the current user
  const displayUser = isImpersonating ? originalUser : (user || auth0User);

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
          <div className="user-role">{displayUser.role}</div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
