import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArrowLeft, Plus, Settings, Users } from 'lucide-react';
import { useApp } from "../store/useApp";
import KanbanColumn from '../components/KanbanColumn';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import ProjectMembers from '../components/ProjectMembers';
import ProjectSettings from '../components/ProjectSettings';
import TaskDetail from '../components/TaskDetail';
import './ProjectBoard.css';

const ProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const { currentProject, tasks, loading, error, user } = state;
  const isAdmin = user ? actions.isAdmin() : false;
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeId: 0
  });

  useEffect(() => {
    if (projectId && user) {
      // Fetch all necessary data when component mounts
      actions.fetchTasksByProject(projectId);
      actions.fetchUsers(); // Ensure users are loaded for assignee dropdown

      // Fetch project members for assignee dropdown
      fetchProjectMembers();

      // Always fetch projects to ensure we have the latest data
      actions.fetchProjects();
    }
  }, [projectId, user?.id]); // Only depend on user.id to prevent infinite loops

  // Separate effect to set current project when projects are loaded
  useEffect(() => {
    if (projectId && state.projects.length > 0) {
      const project = state.projects.find(p => p.id === parseInt(projectId));
      if (project && (!currentProject || currentProject.id !== project.id)) {
        actions.setCurrentProject(project);
      }
    }
  }, [projectId, state.projects.length, currentProject?.id]); // Use specific properties to prevent loops

  const fetchProjectMembers = async () => {
    if (!projectId) return;
    try {
      const members = await actions.fetchProjectMembers(projectId);
      setProjectMembers(members);
    } catch (error) {
      console.error('Error fetching project members:', error);
    }
  };

  const handleTaskDrop = async (taskId, newStatus) => {
    try {
      await actions.updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        projectId: parseInt(projectId),
        status: newTask.status || 'TODO',
      };
      taskData.assigneeId = isAdmin ? parseInt(newTask.assigneeId) : state.user?.id
      await actions.createTask(taskData);
      setShowCreateTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: 0
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const columns = [
    { title: 'TODO', status: 'TODO', tasks: getTasksByStatus('TODO') },
    { title: 'DOING', status: 'DOING', tasks: getTasksByStatus('DOING') },
    { title: 'DONE', status: 'DONE', tasks: getTasksByStatus('DONE') }
  ];

  if (loading && tasks.length === 0) {
    return <Loading message="Loading project board..." />;
  }

  if (!user) {
    return <Loading message="Loading user data..." />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="project-board">
        <div className="project-board-header">
          <div className="project-board-nav">
            <button
              className="back-btn"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={18} />
              Back to Projects
            </button>
            
            {currentProject && (
              <div className="project-info">
                <h1>{currentProject?.name}</h1>
                {currentProject?.description && (
                  <p>{currentProject?.description}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="project-board-actions">
            <button
              className="create-task-btn"
              onClick={() => setShowCreateTaskModal(true)}
            >
              <Plus size={18} />
              Add Task
            </button>

            {currentProject && (
              <button
                className="project-members-btn"
                onClick={() => setShowMembersModal(true)}
              >
                <Users size={18} />
                Members
              </button>
            )}

            {isAdmin && currentProject && (
              <button
                className="project-settings-btn"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings size={18} />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => actions.clearError()}>Dismiss</button>
          </div>
        )}

        <div className="kanban-board">
          {columns.map((column) => (
            <KanbanColumn
              key={column.status}
              title={column.title}
              status={column.status}
              tasks={column.tasks}
              onTaskClick={handleTaskClick}
              onTaskDrop={handleTaskDrop}
            />
          ))}
        </div>

        {/* Create Task Modal */}
        <Modal
          isOpen={showCreateTaskModal}
          onClose={() => setShowCreateTaskModal(false)}
          title="Create New Task"
          size="medium"
        >
          <form onSubmit={handleCreateTask} className="create-task-form">
            <div className="form-group">
              <label htmlFor="task-title">Task Title *</label>
              <input
                id="task-title"
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
                placeholder="Enter task title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
                rows={4}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  value={newTask.status || 'TODO'}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  <option value="TODO">TODO</option>
                  <option value="DOING">DOING</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
              
              {isAdmin && (
                <div className="form-group">
                  <label htmlFor="task-assignee">Assignee *</label>
                  <select
                    id="task-assignee"
                    value={newTask.assigneeId}
                    onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                  >
                    <option value="">Select assignee...</option>
                    {projectMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name || member.email}
                      </option>
                    ))}
                  </select>
                  {!newTask.assigneeId && (
                    <small className="assignee-required">Please select an assignee to create the task</small>
                  )}
                </div>
              )}

            </div>
            {!isAdmin && (
                <div className="assignee-notice">
                  <p>This task will be assigned to you automatically.</p>
                </div>
              )}
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowCreateTaskModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="create-btn"
                disabled={!newTask.title.trim() || (isAdmin && !newTask.assigneeId)}
              >
                Create Task
              </button>
            </div>
          </form>
        </Modal>

        {/* Task Detail Modal */}
        <TaskDetail
          task={selectedTask}
          isVisible={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            // Task will be updated in state automatically by the action
            setSelectedTask(updatedTask);
          }}
          onDelete={() => {
            // Task will be removed from state automatically by the action
            setSelectedTask(null);
          }}
          projectMembers={projectMembers}
        />

        {/* Project Members Modal */}
        <ProjectMembers
          projectId={projectId}
          isVisible={showMembersModal}
          onClose={() => setShowMembersModal(false)}
          onUpdate={(projectRemoved) => actions.fetchTasksByProject(projectRemoved)}
        />

        {/* Project Settings Modal */}
        <ProjectSettings
          project={currentProject}
          isVisible={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onUpdate={(updatedProject) => {
            // Update the current project in state
            actions.setCurrentProject(updatedProject);
          }}
          onDelete={() => {
            // Navigate back to dashboard after deletion
            navigate('/');
          }}
        />
      </div>
    </DndProvider>
  );
};

export default ProjectBoard;
