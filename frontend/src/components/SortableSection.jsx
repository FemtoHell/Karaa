import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableSection = ({ id, children, title }) => {
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
  };

  return (
    <div ref={setNodeRef} style={style} className={`sortable-section ${isDragging ? 'dragging' : ''}`}>
      <div className="section-drag-handle" {...attributes} {...listeners}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ cursor: 'grab' }}>
          <circle cx="4" cy="4" r="1.5" fill="#9CA3AF"/>
          <circle cx="12" cy="4" r="1.5" fill="#9CA3AF"/>
          <circle cx="4" cy="8" r="1.5" fill="#9CA3AF"/>
          <circle cx="12" cy="8" r="1.5" fill="#9CA3AF"/>
          <circle cx="4" cy="12" r="1.5" fill="#9CA3AF"/>
          <circle cx="12" cy="12" r="1.5" fill="#9CA3AF"/>
        </svg>
        <span className="section-title-drag">{title}</span>
      </div>
      {children}
    </div>
  );
};

export default SortableSection;
