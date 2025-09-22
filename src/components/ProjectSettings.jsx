import React, { useState, useEffect } from 'react';
import { Settings, Save, X, Trash2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Modal from './Modal';
import './ProjectSettings.css';

const ProjectSettings = ({ project, isVisible, onClose, onUpdate, onDelete }) => {
  const { state, actions } = useApp();
  const { users } = state;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ownerId: ''
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isAdmin = actions.isAdmin();

  useEffect(() => {
    if (project && isVisible) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        ownerId: project.owner_id || project.ownerId || ''
      });
    }
  }, [project, isVisible]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id) return;

    try {
      setLoading(true);
      const updatedProject = await actions.updateProject(project.id, formData);
      onUpdate?.(updatedProject);
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!project?.id) return;

    try {
      setLoading(true);
      await actions.deleteProject(project.id);
      onDelete?.(project.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      ownerId: ''
    });
    setShowDeleteConfirm(false);
    onClose();
  };

  const getOwnerName = (ownerId) => {
    const owner = users.find(user => user.id === ownerId);
    return owner ? (owner.name || owner.email) : `User ID: ${ownerId}`;
  };

  if (!isVisible || !project) return null;

  return (
    <Modal
      isOpen={isVisible}
      onClose={handleClose}
      title="Project Settings"
      size="medium"
    >
      <div className="project-settings">
        <div className="settings-header">
          <Settings size={20} />
          <span>Update Project Information</span>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="project-name">Project Name</label>
            <input
              type="text"
              id="project-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter project name"
              required
              disabled={!isAdmin}
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter project description"
              rows={4}
              disabled={!isAdmin}
            />
          </div>

          <div className="form-group">
            <label>Project Owner</label>
            <div className="owner-display">
              {getOwnerName(project?.owner_id || project?.ownerId)}
            </div>
          </div>

          {!isAdmin && (
            <div className="permission-notice">
              <p>Only administrators can modify project settings.</p>
            </div>
          )}

          <div className="form-actions">
            <div className="form-actions-left">
              {isAdmin && (
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                >
                  <Trash2 size={16} />
                  Delete Project
                </button>
              )}
            </div>

            <div className="form-actions-right">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClose}
                disabled={loading}
              >
                <X size={16} />
                Cancel
              </button>

              {isAdmin && (
                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading || !formData.name.trim()}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete Project"
          size="small"
        >
          <div className="delete-confirmation">
            <div className="delete-warning">
              <Trash2 size={48} className="warning-icon" />
              <h3>Are you sure you want to delete this project?</h3>
              <p>
                This action cannot be undone. All tasks and data associated with
                "<strong>{project?.name}</strong>" will be permanently deleted.
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
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 size={16} />
                {loading ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default ProjectSettings;
