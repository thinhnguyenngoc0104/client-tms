import React from 'react';
import { ArrowLeft, User, Shield } from 'lucide-react';
import { useApp } from "../store/useApp";
import './ImpersonationIndicator.css';

const ImpersonationIndicator = () => {
  const { actions } = useApp();
  const isImpersonating = actions.isImpersonating();
  const originalUser = actions.getOriginalUser();
  const impersonatedUser = actions.getImpersonatedUser();

  if (!isImpersonating || !originalUser || !impersonatedUser) {
    return null;
  }

  const handleStopImpersonation = () => {
    actions.stopImpersonation();
  };

  return (
    <div className="impersonation-indicator">
      <button
        className="stop-impersonation-btn"
        onClick={handleStopImpersonation}
        title="Stop impersonation and return to your account"
      >
        <ArrowLeft size={16} />
        <span>Return</span>
      </button>
      
      <div className="impersonation-info">
        <div className="impersonation-label">
          Viewing as:
        </div>
        <div className="impersonated-user-info">
          <div className="impersonated-user-avatar">
            {impersonatedUser.pictureUrl ? (
              <img src={impersonatedUser.pictureUrl} alt={impersonatedUser.name} />
            ) : (
              <User size={16} />
            )}
          </div>
          <div className="impersonated-user-details">
            <div className="impersonated-user-name">
              {impersonatedUser.name || impersonatedUser.email}
              {impersonatedUser.role === 'ADMIN' && (
                <span className="impersonated-admin-badge">
                  <Shield size={10} />
                </span>
              )}
            </div>
            <div className="impersonated-user-email">
              {impersonatedUser.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpersonationIndicator;
