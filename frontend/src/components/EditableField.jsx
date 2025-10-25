import React, { useRef, useEffect, useState } from 'react';
import './EditableField.css';

/**
 * Enhanced EditableField with Rich Text Support
 * Supports: bold, italic, underline, lists, and basic formatting
 */
const EditableField = ({
  value,
  onChange,
  placeholder = '',
  multiline = false,
  richText = false,
  className = '',
  style = {},
}) => {
  const ref = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  // Sync value
  useEffect(() => {
    if (ref.current) {
      const currentContent = richText ? ref.current.innerHTML : ref.current.textContent;
      if (currentContent !== value) {
        if (richText) {
          ref.current.innerHTML = value || '';
        } else {
          ref.current.textContent = value || '';
        }
      }
    }
  }, [value, richText]);

  const handleBlur = (e) => {
    const newValue = richText ? e.target.innerHTML : e.target.textContent;
    onChange(newValue);
    e.target.style.borderColor = 'transparent';
    // Hide toolbar after a short delay to allow toolbar clicks
    setTimeout(() => setShowToolbar(false), 200);
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

  const handleMouseUp = () => {
    if (!richText || !multiline) return;

    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setToolbarPosition({
        top: rect.top - 50 + window.scrollY,
        left: rect.left + (rect.width / 2) + window.scrollX
      });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    ref.current.focus();
    // Update content after formatting
    const newValue = ref.current.innerHTML;
    onChange(newValue);
  };

  const isCommandActive = (command) => {
    return document.queryCommandState(command);
  };

  return (
    <>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
        className={`editable-field ${className}`}
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
        dangerouslySetInnerHTML={richText ? { __html: value } : undefined}
      >
        {!richText && value}
      </div>

      {/* Rich Text Toolbar */}
      {richText && multiline && showToolbar && (
        <div
          className="rich-text-toolbar"
          style={{
            position: 'absolute',
            top: toolbarPosition.top,
            left: toolbarPosition.left,
            transform: 'translateX(-50%)',
            zIndex: 1000
          }}
          onMouseDown={(e) => e.preventDefault()} // Prevent blur
        >
          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('bold') ? 'active' : ''}`}
            onClick={() => formatText('bold')}
            title="Bold (Ctrl+B)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 2h5c1.66 0 3 1.34 3 3s-1.34 3-3 3H3V2zm0 6h6c1.66 0 3 1.34 3 3s-1.34 3-3 3H3V8z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('italic') ? 'active' : ''}`}
            onClick={() => formatText('italic')}
            title="Italic (Ctrl+I)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6 2h6v2h-2l-2 6h2v2H4v-2h2l2-6H6V2z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('underline') ? 'active' : ''}`}
            onClick={() => formatText('underline')}
            title="Underline (Ctrl+U)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 2v5c0 2.21 1.79 4 4 4s4-1.79 4-4V2h-2v5c0 1.1-.9 2-2 2s-2-.9-2-2V2H3zm0 11h8v1H3v-1z" fill="currentColor"/>
            </svg>
          </button>

          <div className="toolbar-divider"></div>

          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('insertUnorderedList') ? 'active' : ''}`}
            onClick={() => formatText('insertUnorderedList')}
            title="Bullet List"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3h1v1H2V3zm3 0h7v1H5V3zM2 6.5h1v1H2v-1zm3 0h7v1H5v-1zM2 10h1v1H2v-1zm3 0h7v1H5v-1z" fill="currentColor"/>
            </svg>
          </button>

          <button
            type="button"
            className={`toolbar-btn ${isCommandActive('insertOrderedList') ? 'active' : ''}`}
            onClick={() => formatText('insertOrderedList')}
            title="Numbered List"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3h1v2H2V3zm0 4h1v1H2V7zm0 3h1v1H2v-1zm3-7h7v1H5V3zm0 4h7v1H5V7zm0 3h7v1H5v-1z" fill="currentColor"/>
            </svg>
          </button>

          <div className="toolbar-divider"></div>

          <button
            type="button"
            className="toolbar-btn"
            onClick={() => formatText('removeFormat')}
            title="Clear Formatting"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}
    </>
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
