import React, { useRef, useEffect } from 'react';

/**
 * SIMPLE EDITABLE - Designed specifically to NOT interfere with drag & drop
 * NO stopPropagation, NO complex state, JUST contentEditable
 */
const SimpleEditable = ({ 
  value, 
  onChange, 
  placeholder = 'Click to edit...', 
  multiline = false,
  className = '',
  style = {} 
}) => {
  const ref = useRef(null);

  // Update content when value changes externally
  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value || '';
    }
  }, [value]);

  const handleBlur = (e) => {
    const newValue = e.target.textContent;
    onChange(newValue);
  };

  const handleKeyDown = (e) => {
    // Single line: Enter to blur
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      ref.current?.blur();
    }
    // Escape: revert and blur
    if (e.key === 'Escape') {
      e.preventDefault();
      if (ref.current) {
        ref.current.textContent = value || '';
      }
      ref.current?.blur();
    }
  };

  const isEmpty = !value || value.trim() === '';

  const handleBlurWithStyle = (e) => {
    const newValue = e.target.textContent;
    onChange(newValue);
    e.target.style.borderColor = 'transparent';
    e.target.style.background = 'transparent';
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#4f46e5';
    e.target.style.background = 'rgba(79, 70, 229, 0.05)';
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlurWithStyle}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      className={className}
      data-placeholder={isEmpty ? placeholder : ''}
      style={{
        outline: 'none',
        cursor: 'text',
        minHeight: multiline ? '60px' : '20px',
        padding: '4px',
        borderRadius: '4px',
        border: '1px solid transparent',
        transition: 'all 0.2s',
        position: 'relative',
        ...style,
        ...(isEmpty && {
          color: 'transparent',
        })
      }}
    >
      {value}
    </div>
  );
};

// Add CSS for placeholder
const style = document.createElement('style');
style.textContent = `
  [data-placeholder]:empty:before {
    content: attr(data-placeholder);
    color: #9CA3AF;
    font-style: italic;
    pointer-events: none;
  }
`;
document.head.appendChild(style);

export default SimpleEditable;
