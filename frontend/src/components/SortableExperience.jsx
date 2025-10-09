import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableExperience = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'default',
  };

  const handleStyle = {
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none', // Prevent scrolling while dragging
  };

  return (
    <div ref={setNodeRef} style={style} className={`sortable-item ${isDragging ? 'dragging' : ''}`}>
      <div
        className="item-drag-handle"
        {...attributes}
        {...listeners}
        title="Click and hold to drag"
        style={handleStyle}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="7" cy="5" r="1.5" fill="#9CA3AF"/>
          <circle cx="13" cy="5" r="1.5" fill="#9CA3AF"/>
          <circle cx="7" cy="10" r="1.5" fill="#9CA3AF"/>
          <circle cx="13" cy="10" r="1.5" fill="#9CA3AF"/>
          <circle cx="7" cy="15" r="1.5" fill="#9CA3AF"/>
          <circle cx="13" cy="15" r="1.5" fill="#9CA3AF"/>
        </svg>
      </div>
      <div className="sortable-item-content">
        {children}
      </div>
    </div>
  );
};

export default SortableExperience;
