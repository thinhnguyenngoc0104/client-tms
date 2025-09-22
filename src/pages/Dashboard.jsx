import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../store/AppContext';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const { projects, loading, error, user } = state;
  const isAdmin = user ? actions.isAdmin() : false;
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    actions.fetchProjects();
    actions.fetchUsers();
  }, [user?.id]);

  const handleProjectClick = (project) => {
    actions.setCurrentProject(project);
    navigate(`/project/${project.id}`);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...newProject,
        ownerId: state.user?.id
      };
      await actions.createProject(projectData);
      setShowCreateModal(false);
      setNewProject({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && projects.length === 0) {
    return <Loading message="Loading projects..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Projects</h1>
          <p>Manage your projects and track progress</p>
        </div>
        
        <div className="dashboard-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isAdmin && (
            <button
              className="create-project-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              New Project
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

      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={handleProjectClick}
            />
          ))
        ) : (
          <div className="no-projects">
            <h3>No projects found</h3>
            <p>
              {searchTerm
                ? 'Try adjusting your search terms'
                : isAdmin
                  ? 'Create your first project to get started'
                  : 'Contact your administrator to create a project'
              }
            </p>
            {!searchTerm && isAdmin && (
              <button
                className="create-first-project-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={18} />
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {isAdmin && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Project"
          size="medium"
        >
        <form onSubmit={handleCreateProject} className="create-project-form">
          <div className="form-group">
            <label htmlFor="project-name">Project Name *</label>
            <input
              id="project-name"
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              required
              placeholder="Enter project name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Enter project description"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Project Owner</label>
            <div className="owner-display">
              {user?.name || user?.email || 'Current User'}
            </div>
            <small className="owner-note">You will be assigned as the project owner</small>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-btn"
              disabled={!newProject.name.trim()}
            >
              Create Project
            </button>
          </div>
        </form>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
