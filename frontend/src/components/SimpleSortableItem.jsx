import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * SimpleSortableItem - COPIED FROM DragTestSimple
 * Drag handle completely separate from content
 */
const SimpleSortableItem = ({ id, children }) => {
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
    position: 'relative',
    padding: '16px 16px 16px 56px',
    margin: '12px 0',
    backgroundColor: isDragging ? '#dbeafe' : '#f9fafb',
    border: `2px solid ${isDragging ? '#3b82f6' : '#e5e7eb'}`,
    borderRadius: '12px',
    opacity: isDragging ? 0.5 : 1,
    minHeight: '80px',
  };

  const handleStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32px',
    height: '80%',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'grab',
    touchAction: 'none',
    userSelect: 'none',
    zIndex: 999,
    pointerEvents: 'auto',
  };

  const handleActiveStyle = {
    ...handleStyle,
    cursor: 'grabbing',
    background: '#e0e7ff',
    borderColor: '#4f46e5',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* DRAG HANDLE */}
      <div
        ref={setActivatorNodeRef}
        style={isDragging ? handleActiveStyle : handleStyle}
        {...attributes}
        {...listeners}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="7" cy="5" r="2" fill="#9CA3AF"/>
          <circle cx="13" cy="5" r="2" fill="#9CA3AF"/>
          <circle cx="7" cy="10" r="2" fill="#9CA3AF"/>
          <circle cx="13" cy="10" r="2" fill="#9CA3AF"/>
          <circle cx="7" cy="15" r="2" fill="#9CA3AF"/>
          <circle cx="13" cy="15" r="2" fill="#9CA3AF"/>
        </svg>
      </div>

      {/* CONTENT */}
      {children}
    </div>
  );
};

export default SimpleSortableItem;
