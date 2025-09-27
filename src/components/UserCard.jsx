import React from 'react';
import { User, UserCheck, Shield } from 'lucide-react';
import { useApp } from "../store/useApp";
import './UserCard.css';

const UserCard = ({ user }) => {
  const { state, actions } = useApp();
  const { user: currentUser } = state;
  const isAdmin = actions.isAdmin();
  const isCurrentUser = currentUser?.id === user.id;
  const isImpersonating = actions.isImpersonating();
  const isImpersonatedUser = isImpersonating && actions.getImpersonatedUser()?.id === user.id;

  const handleImpersonate = () => {
    actions.startImpersonation(user.id);
  };

  return (
    <div className={`user-card ${isCurrentUser ? 'current-user' : ''} ${isImpersonatedUser ? 'impersonated-user' : ''}`}>
      <div className="user-card-avatar">
        {user.pictureUrl ? (
          <img src={user.pictureUrl} alt={user.name} />
        ) : (
          <User size={24} />
        )}
      </div>
      
      <div className="user-card-info">
        <div className="user-card-name">
          {user.name || user.email}
          {user.role === 'ADMIN' && (
            <span className="user-card-admin-badge">
              <Shield size={10} />
            </span>
          )}
        </div>
        <div className="user-card-email">{user.email}</div>
        {user.role && (
          <div className="user-card-role">{user.role}</div>
        )}
      </div>

      {isAdmin && !isCurrentUser && (
        <button
          className="impersonate-btn"
          onClick={handleImpersonate}
          title={`Impersonate ${user.name || user.email}`}
        >
          <UserCheck size={16} />
        </button>
      )}

      {isImpersonatedUser && (
        <div className="impersonated-indicator">
          <UserCheck size={16} />
          <span>Active</span>
        </div>
      )}
    </div>
  );
};

export default UserCard;
