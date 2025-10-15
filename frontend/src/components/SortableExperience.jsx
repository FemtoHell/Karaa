import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableExperience = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '16px',
    paddingLeft: '48px', // Space for drag handle
    margin: '8px 0',
    background: isDragging ? '#e0e7ff' : '#f9fafb',
    border: '2px solid ' + (isDragging ? '#4f46e5' : '#e5e7eb'),
    borderRadius: '8px',
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
  };

  const dragHandleStyle = {
    position: 'absolute',
    left: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    background: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    touchAction: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
  };

  const dragHandleActiveStyle = {
    ...dragHandleStyle,
    cursor: 'grabbing',
    background: '#f3f4f6',
    borderColor: '#4f46e5',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      {/* Drag Handle Icon - ONLY this part is draggable */}
      <div
        ref={setActivatorNodeRef}
        style={isDragging ? dragHandleActiveStyle : dragHandleStyle}
        {...listeners}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6" cy="3" r="1.5" fill="#9CA3AF"/>
          <circle cx="10" cy="3" r="1.5" fill="#9CA3AF"/>
          <circle cx="6" cy="8" r="1.5" fill="#9CA3AF"/>
          <circle cx="10" cy="8" r="1.5" fill="#9CA3AF"/>
          <circle cx="6" cy="13" r="1.5" fill="#9CA3AF"/>
          <circle cx="10" cy="13" r="1.5" fill="#9CA3AF"/>
        </svg>
      </div>
      
      {/* Content - NOT draggable, can interact normally */}
      <div style={{ userSelect: 'text', touchAction: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

export default SortableExperience;
