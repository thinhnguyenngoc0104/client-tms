import React, { useState, useEffect  } from 'react';
import { Users, Plus, X, UserMinus, Trash2 } from 'lucide-react';
import { useApp } from "../store/useApp";
import Modal from './Modal';
import './ProjectMembers.css';

const ProjectMembers = ({ projectId, isVisible, onClose, onUpdate }) => {
  const { state, actions } = useApp();
  const { users } = state;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const isAdmin = actions.isAdmin();

  useEffect(() => {
    fetchMembers()
  }, [projectId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const projectMembers = await actions.fetchProjectMembers(projectId);
      console.log(projectMembers)
      setMembers(projectMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      await actions.addProjectMember(projectId, parseInt(selectedUserId));
      setShowAddModal(false);
      setSelectedUserId('');
      fetchMembers(); // Refresh members list
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async () => {
    if (!currentMember?.id) return;

    try {
      await actions.removeProjectMember(projectId, currentMember?.id);
      fetchMembers(); // Refresh members list
      onUpdate?.(projectId);
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const availableUsers = users.filter(user =>
    !members.some(member => member.id === user.id) && user.email !== 'thinh@gmail.com'
  );
  if (!isVisible) return null;

  return (
    <Modal
      isOpen={isVisible}
      onClose={onClose}
      title="Project Members"
      size="medium"
    >
      <div className="project-members">
        <div className="members-header">
          <div className="members-count">
            <Users size={18} />
            <span>{members.length} member{members.length !== 1 ? 's' : ''}</span>
          </div>

          {isAdmin && availableUsers.length > 0 && (
            <button
              className="add-member-btn"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              Add Member
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-members">Loading members...</div>
        ) : (
          <div className="members-list">
            {members.length > 0 ? (
              members.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-info">
                    <div className="member-avatar">
                      {member.name ? member.name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="member-details">
                      <div className="member-name">{member.name || member.email}</div>
                      <div className="member-email">{member.email}</div>
                      {member.role && (
                        <div className="member-role">{member.role}</div>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      className="remove-member-btn"
                      onClick={() => {
                        setShowDeleteConfirm(true)
                        setCurrentMember(member)
                      }}
                      title="Remove member"
                    >
                      <UserMinus size={16} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="no-members">
                <p>No members in this project yet.</p>
                {isAdmin && (
                  <p>Click "Add Member" to invite team members.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add Member Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedUserId('');
          }}
          title="Add Project Member"
          size="small"
        >
          <form onSubmit={handleAddMember} className="add-member-form">
            <div className="form-group">
              <label htmlFor="user-select">Select User</label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
              >
                <option value="">Choose a user...</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedUserId('');
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="add-btn"
                disabled={!selectedUserId}
              >
                Add Member
              </button>
            </div>
          </form>
        </Modal>
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <Modal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            title="Remove Member"
            size="small"
          >
            <div className="delete-confirmation">
              <div className="delete-warning">
                <Trash2 size={48} className="warning-icon" />
                <h3>Are you sure you want to remove this member?</h3>
                <p>
                  This action cannot be undone. All tasks and data associated with
                  "<strong>{currentMember?.name}</strong>" will be permanently deleted.
                </p>
              </div>

              <div className="delete-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="delete-confirm-btn"
                  onClick={() => handleRemoveMember()}
                  disabled={loading}
                >
                  <Trash2 size={16} />
                  {loading ? 'Deleting...' : 'Remove member'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Modal>
  );
};

export default ProjectMembers;
