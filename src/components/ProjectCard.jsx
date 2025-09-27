import React from 'react';
import { Folder, User, Calendar } from 'lucide-react';
import './ProjectCard.css';

const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="project-card" onClick={() => onClick(project)}>
      <div className="project-card-header">
        <div className="project-icon">
          <Folder size={24} />
        </div>
        <h3 className="project-name">{project.name}</h3>
      </div>
      
      {project.description && (
        <p className="project-description">{project.description}</p>
      )}
      
      <div className="project-card-footer">
        <div className="project-owner">
          <User size={14} />
          <span>{project.owner?.name || project.owner?.email || 'Unassigned'}</span>
        </div>
        
        {project.created_at && (
          <div className="project-date">
            <Calendar size={14} />
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
