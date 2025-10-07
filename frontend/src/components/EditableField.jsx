import React, { useState, useRef, useEffect } from 'react';
import './EditableField.css';

const EditableField = ({
  value,
  onChange,
  placeholder = 'Click to edit...',
  multiline = false,
  className = '',
  style = {},
  onFocus,
  onBlur
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const editableRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      if (editableRef.current.childNodes.length > 0) {
        range.setStart(editableRef.current.childNodes[0], editableRef.current.textContent.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
    if (onFocus) onFocus();
  };

  const handleBlur = (e) => {
    setIsEditing(false);
    const newValue = e.target.textContent;
    setLocalValue(newValue);
    onChange(newValue);
    if (onBlur) onBlur();
  };

  const handleInput = (e) => {
    setLocalValue(e.target.textContent);
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      editableRef.current.blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setLocalValue(value || '');
      editableRef.current.textContent = value || '';
      editableRef.current.blur();
    }
  };

  const isEmpty = !localValue || localValue.trim() === '';

  return (
    <div
      ref={editableRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onClick={handleClick}
      onBlur={handleBlur}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={`editable-field ${className} ${isEmpty ? 'empty' : ''} ${isEditing ? 'editing' : ''}`}
      style={style}
      data-placeholder={placeholder}
    >
      {localValue}
    </div>
  );
};

export default EditableField;
