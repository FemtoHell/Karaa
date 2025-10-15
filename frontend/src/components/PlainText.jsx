import React, { useRef, useEffect } from 'react';

/**
 * ULTRA SIMPLE - Just plain contentEditable, NO event blocking
 * Specifically designed to NOT interfere with drag & drop
 */
const PlainText = ({ value, onChange, placeholder, multiline = false, style = {} }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value || '';
    }
  }, [value]);

  const handleBlur = (e) => {
    onChange(e.target.textContent);
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  const isEmpty = !value || value.trim() === '';

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{
        outline: 'none',
        border: '1px solid transparent',
        borderRadius: '4px',
        padding: '4px',
        minHeight: '20px',
        cursor: 'text',
        ...style,
        ...(isEmpty && {
          position: 'relative',
        })
      }}
      data-placeholder={isEmpty ? placeholder : ''}
    >
      {value}
    </div>
  );
};

export default PlainText;
