import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Save, X, User, Calendar, Flag } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Modal from './Modal';
import './TaskDetail.css';

const TaskDetail = ({ task, isVisible, onClose, onUpdate, onDelete, projectMembers = [] }) => {
  const { state, actions } = useApp();
  const { users, user } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeId: ''
  });
  const [loading, setLoading] = useState(false);

  const canEdit = task ? actions.canUpdateTask(task) : false;
  const canDelete = task ? actions.canDeleteTask(task) : false;
  const isAdmin = actions.isAdmin();

  useEffect(() => {
    if (task && isVisible) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        assigneeId: task.assignee_id || task.assigneeId || ''
      });
      setIsEditing(false);
    }
  }, [task, isVisible]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!task?.id) return;

    try {
      setLoading(true);
      const updatedTask = await actions.updateTask(task.id, formData);
      onUpdate?.(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task?.id) return;
    
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setLoading(true);
      await actions.deleteTask(task.id);
      onDelete?.(task.id);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      assigneeId: ''
    });
    onClose();
  };

  const getAssigneeName = (assigneeId) => {
    const assignee = users.find(user => user.id === assigneeId);
    return assignee ? (assignee.name || assignee.email) : 'Unassigned';
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ff5630';
      case 'medium': return '#ffab00';
      case 'low': return '#36b37e';
      default: return '#6b778c';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'todo': return '#6b778c';
      case 'doing': return '#0052cc';
      case 'done': return '#36b37e';
      default: return '#6b778c';
    }
  };

  if (!isVisible || !task || !user) return null;

  return (
    <Modal
      isOpen={isVisible}
      onClose={handleClose}
      title={isEditing ? 'Edit Task' : 'Task Details'}
      size="large"
    >
      <div className="task-detail">
        <div className="task-header">
          <div className="task-meta">
            <span 
              className="task-status"
              style={{ backgroundColor: getStatusColor(task.status) }}
            >
              {task.status?.toUpperCase()}
            </span>
            <span 
              className="task-priority"
              style={{ color: getPriorityColor(task.priority) }}
            >
              <Flag size={14} />
              {task.priority?.toUpperCase()}
            </span>
          </div>
          
          <div className="task-actions">
            {canEdit && !isEditing && (
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                <Edit size={16} />
                Edit
              </button>
            )}
            
            {canDelete && (
              <button
                className="delete-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="task-edit-form">
            <div className="form-group">
              <label htmlFor="edit-title">Title</label>
              <input
                type="text"
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-description">Description</label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-status">Status</label>
                <select
                  id="edit-status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="TODO">TODO</option>
                  <option value="DOING">DOING</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-priority">Priority</label>
                <select
                  id="edit-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
            </div>

            {isAdmin && (
              <div className="form-group">
                <label htmlFor="edit-assignee">Assignee</label>
                <select
                  id="edit-assignee"
                  name="assigneeId"
                  value={formData.assigneeId}
                  onChange={handleInputChange}
                >
                  <option value="">Select assignee...</option>
                  {projectMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name || member.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="edit-actions">
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                <X size={16} />
                Cancel
              </button>
              
              <button
                type="button"
                className="save-edit-btn"
                onClick={handleSave}
                disabled={loading || !formData.title.trim()}
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="task-content">
            <h3 className="task-title">{task.title}</h3>
            
            {task.description && (
              <div className="task-description">
                <p>{task.description}</p>
              </div>
            )}

            <div className="task-info">
              <div className="info-item">
                <User size={16} />
                <span>Assigned to: {getAssigneeName(task.assignee_id || task.assigneeId)}</span>
              </div>
              
              {task.created_at && (
                <div className="info-item">
                  <Calendar size={16} />
                  <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {!canEdit && !canDelete && (
              <div className="permission-notice">
                <p>You can only edit and delete your own tasks.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TaskDetail;

// CSS will be added in TaskDetail.css
