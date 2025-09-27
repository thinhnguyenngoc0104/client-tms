import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import './KanbanColumn.css';

const KanbanColumn = ({ title, status, tasks, onTaskClick, onTaskDrop }) => {  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => {
      if (item.status !== status) {
        onTaskDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Sort tasks by priority (High -> Medium -> Low)
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority?.toLowerCase()] || 0;
    const bPriority = priorityOrder[b.priority?.toLowerCase()] || 0;
    return bPriority - aPriority;
  });

  return (
    <div className={`kanban-column ${isOver ? 'drag-over' : ''}`} ref={drop}>
      <div className="kanban-column-header">
        <h3 className="kanban-column-title">{title}</h3>
        <span className="kanban-column-count">{tasks.length}</span>
      </div>
      
      <div className="kanban-column-content">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="kanban-column-empty">
            <p>No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
