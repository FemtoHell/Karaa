import React from 'react';
import './CustomizationPanel.css';

const CustomizationPanel = ({ customization, setCustomization, onClose }) => {
  
  const fonts = [
    { name: 'Inter', label: 'Inter (Modern)', style: 'Inter, sans-serif' },
    { name: 'Roboto', label: 'Roboto (Clean)', style: 'Roboto, sans-serif' },
    { name: 'Open Sans', label: 'Open Sans (Friendly)', style: '"Open Sans", sans-serif' },
    { name: 'Lato', label: 'Lato (Professional)', style: 'Lato, sans-serif' },
    { name: 'Playfair Display', label: 'Playfair (Elegant)', style: '"Playfair Display", serif' },
    { name: 'Merriweather', label: 'Merriweather (Classic)', style: 'Merriweather, serif' },
    { name: 'Montserrat', label: 'Montserrat (Bold)', style: 'Montserrat, sans-serif' },
    { name: 'Poppins', label: 'Poppins (Trendy)', style: 'Poppins, sans-serif' },
  ];

  const colorSchemes = [
    { 
      name: 'blue', 
      label: 'Professional Blue',
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)'
    },
    { 
      name: 'purple', 
      label: 'Creative Purple',
      primary: '#8B5CF6',
      secondary: '#6D28D9',
      accent: '#A78BFA',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'
    },
    { 
      name: 'green', 
      label: 'Fresh Green',
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    },
    { 
      name: 'red', 
      label: 'Bold Red',
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F87171',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
    },
    { 
      name: 'orange', 
      label: 'Warm Orange',
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FBBF24',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    },
    { 
      name: 'teal', 
      label: 'Modern Teal',
      primary: '#14B8A6',
      secondary: '#0D9488',
      accent: '#2DD4BF',
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)'
    },
    { 
      name: 'pink', 
      label: 'Elegant Pink',
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#F472B6',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
    },
    { 
      name: 'gray', 
      label: 'Classic Gray',
      primary: '#6B7280',
      secondary: '#4B5563',
      accent: '#9CA3AF',
      gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
    },
  ];

  const fontSizes = [
    { name: 'small', label: 'Small', scale: 0.9 },
    { name: 'medium', label: 'Medium', scale: 1.0 },
    { name: 'large', label: 'Large', scale: 1.1 },
  ];

  const spacings = [
    { name: 'compact', label: 'Compact', scale: 0.8 },
    { name: 'normal', label: 'Normal', scale: 1.0 },
    { name: 'relaxed', label: 'Relaxed', scale: 1.2 },
  ];

  const layouts = [
    { 
      name: 'single-column', 
      label: 'Single Column',
      description: 'Traditional layout with one column',
      icon: '📄'
    },
    { 
      name: 'two-column', 
      label: 'Two Columns',
      description: 'Modern layout with sidebar',
      icon: '📰'
    },
    { 
      name: 'split', 
      label: 'Split Layout',
      description: 'Equal width columns',
      icon: '🔀'
    },
  ];

  const handleChange = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="customization-overlay">
      <div className="customization-panel">
        {/* Header */}
        <div className="customization-header">
          <h2>🎨 Customize Resume</h2>
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="customization-content">
          {/* Font Selection */}
          <div className="customization-section">
            <h3>✍️ Font Family</h3>
            <div className="option-grid">
              {fonts.map(font => (
                <button
                  key={font.name}
                  className={`option-btn ${customization.font === font.name ? 'active' : ''}`}
                  onClick={() => handleChange('font', font.name)}
                  style={{ fontFamily: font.style }}
                >
                  <span className="option-label">{font.label}</span>
                  <span className="option-preview" style={{ fontFamily: font.style }}>Aa</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="customization-section">
            <h3>📏 Font Size</h3>
            <div className="option-grid small">
              {fontSizes.map(size => (
                <button
                  key={size.name}
                  className={`option-btn ${customization.fontSize === size.name ? 'active' : ''}`}
                  onClick={() => handleChange('fontSize', size.name)}
                >
                  <span className="option-label">{size.label}</span>
                  <span className="option-value">{Math.round(size.scale * 100)}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="customization-section">
            <h3>🎨 Color Scheme</h3>
            <div className="color-grid">
              {colorSchemes.map(scheme => (
                <button
                  key={scheme.name}
                  className={`color-btn ${customization.colorScheme === scheme.name ? 'active' : ''}`}
                  onClick={() => handleChange('colorScheme', scheme.name)}
                >
                  <div 
                    className="color-preview" 
                    style={{ background: scheme.gradient }}
                  />
                  <span className="color-label">{scheme.label}</span>
                  <div className="color-dots">
                    <span style={{ backgroundColor: scheme.primary }} />
                    <span style={{ backgroundColor: scheme.secondary }} />
                    <span style={{ backgroundColor: scheme.accent }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="customization-section">
            <h3>📐 Spacing</h3>
            <div className="option-grid small">
              {spacings.map(spacing => (
                <button
                  key={spacing.name}
                  className={`option-btn ${customization.spacing === spacing.name ? 'active' : ''}`}
                  onClick={() => handleChange('spacing', spacing.name)}
                >
                  <span className="option-label">{spacing.label}</span>
                  <span className="option-value">{Math.round(spacing.scale * 100)}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Layout */}
          <div className="customization-section">
            <h3>📱 Layout</h3>
            <div className="layout-grid">
              {layouts.map(layout => (
                <button
                  key={layout.name}
                  className={`layout-btn ${customization.layout === layout.name ? 'active' : ''}`}
                  onClick={() => handleChange('layout', layout.name)}
                >
                  <span className="layout-icon">{layout.icon}</span>
                  <span className="layout-label">{layout.label}</span>
                  <span className="layout-desc">{layout.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="customization-footer">
          <button onClick={onClose} className="btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
