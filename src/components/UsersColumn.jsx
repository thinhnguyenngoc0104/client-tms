import React, { useEffect, useState } from 'react';
import { Users, Search, RefreshCw } from 'lucide-react';
import { useApp } from "../store/useApp";
import UserCard from './UserCard';
import Loading from './Loading';
import './UsersColumn.css';

const UsersColumn = () => {
  const { state, actions } = useApp();
  const { users, loading, error } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [fetched, setFetched] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    if (!fetched) {
      actions.fetchUsers();
      setFetched(true);
    }
  }, [fetched, actions]);

  // Refresh users when impersonation state changes
  const isImpersonating = actions.isImpersonating();
  const [lastImpersonatingState, setLastImpersonatingState] = useState(null);

  useEffect(() => {
    // Only refresh when impersonation state actually changes
    if (lastImpersonatingState !== null && lastImpersonatingState !== isImpersonating) {
      // Small delay to ensure state is fully updated
      const timer = setTimeout(() => {
        actions.fetchUsers();
        // Force component re-render by updating fetched state
        setFetched(false);
        setTimeout(() => setFetched(true), 50);
      }, 100);

      return () => clearTimeout(timer);
    }
    setLastImpersonatingState(isImpersonating);
  }, [isImpersonating, lastImpersonatingState, actions]);

  // Filter users based on search term
  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  const handleRefresh = () => {
    actions.fetchUsers();
  };

  return (
    <div className="users-column">
      <div className="users-column-header">
        <div className="users-column-title">
          <Users size={18} />
          <h3>Users</h3>
        </div>
        <button
          className="refresh-users-btn"
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh users list"
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
        </button>
      </div>

      <div className="users-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="users-error">
          <p>Error loading users: {error}</p>
          <button onClick={handleRefresh}>Retry</button>
        </div>
      )}

      <div className="users-list">
        {loading && !users.length ? (
          <div className="users-loading">
            <Loading message="Loading users..." />
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              // onImpersonate={handleImpersonate}
            />
          ))
        ) : (
          <div className="no-users">
            <p>
              {searchTerm
                ? 'No users match your search'
                : 'No users found'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersColumn;
