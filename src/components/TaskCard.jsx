import React from 'react';
import { useDrag } from 'react-dnd';
import { User, AlertCircle, Clock } from 'lucide-react';
import { useApp } from '../store/AppContext';
import './TaskCard.css';

const TaskCard = ({ task, onClick }) => {
  const { state, actions } = useApp();
  const { user } = state;
  const isAdmin = actions.isAdmin();

  // Allow drag only if user is admin or owns the task
  const taskAssigneeId = task.assignee_id || task.assigneeId;
  const canDrag = isAdmin || taskAssigneeId === user?.id;
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, status: task.status },
    canDrag: () => canDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return '#ff5630';
      case 'MEDIUM':
        return '#ff8b00';
      case 'LOW':
        return '#36b37e';
      default:
        return '#6b778c';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <AlertCircle size={14} />;
      case 'MEDIUM':
        return <Clock size={14} />;
      case 'LOW':
        return <Clock size={14} />;
      default:
        return null;
    }
  };

  const isOwnTask = taskAssigneeId === user?.id;

  return (
    <div
      ref={canDrag ? drag : null}
      className={`task-card ${isDragging ? 'dragging' : ''} ${isOwnTask ? 'own-task' : ''} ${!canDrag ? 'no-drag' : ''}`}
      onClick={() => onClick(task)}
    >
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        {task.priority && (
          <div 
            className="task-priority"
            style={{ color: getPriorityColor(task.priority) }}
          >
            {getPriorityIcon(task.priority)}
            <span>{task.priority}</span>
          </div>
        )}
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-card-footer">
        {task.assignee && (
          <div className="task-assignee">
            <User size={14} />
            <span>{task.assignee.name || task.assignee.email}</span>
          </div>
        )}
        
        {task.createdAt && (
          <div className="task-date">
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
