import React, { useRef, useEffect } from 'react';

/**
 * SIMPLE EditableField - COPIED FROM DragTestSimple
 * NO state, NO onClick, contentEditable ALWAYS true
 */
const EditableField = ({
  value,
  onChange,
  placeholder = '',
  multiline = false,
  className = '',
  style = {},
}) => {
  const ref = useRef(null);

  // Sync value
  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value || '';
    }
  }, [value]);

  const handleBlur = (e) => {
    onChange(e.target.textContent);
    e.target.style.borderColor = 'transparent';
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#4f46e5';
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      className={className}
      style={{
        outline: 'none',
        border: '1px solid transparent',
        borderRadius: '4px',
        padding: '4px 8px',
        minHeight: multiline ? '60px' : '20px',
        transition: 'border-color 0.2s',
        ...style,
      }}
      data-placeholder={!value ? placeholder : ''}
    >
      {value}
    </div>
  );
};

// Placeholder style
if (typeof document !== 'undefined') {
  const id = 'editable-placeholder';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      [contenteditable][data-placeholder]:empty:before {
        content: attr(data-placeholder);
        color: #9CA3AF;
        font-style: italic;
      }
    `;
    document.head.appendChild(style);
  }
}

export default EditableField;
