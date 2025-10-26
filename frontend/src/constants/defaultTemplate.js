/**
 * ================================================================================
 * DEFAULT TEMPLATE CONFIGURATION
 * ================================================================================
 * Shared default template fallback used across:
 * - ResumePreview.jsx
 * - CompareVersions.jsx
 * - MiniTemplatePreview.jsx (optional)
 *
 * This ensures consistent rendering when template data is missing
 * ================================================================================
 */

export const DEFAULT_TEMPLATE = {
  name: 'Classic',
  color: '#3B82F6',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

  // Full layout configuration
  layout: {
    type: 'single-column',
    columns: {
      count: 1,
      widths: ['100%'],
      gap: '0px'
    }
  },

  // Complete section configuration
  sections: {
    order: [
      'personal',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certificates',
      'activities'
    ],
    visible: {
      personal: true,
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certificates: true,
      activities: true
    }
  },

  // Full typography configuration
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    sizes: {
      name: '36px',
      heading: '20px',
      subheading: '17px',
      body: '14px'
    }
  },

  // Complete colors configuration
  colors: {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    text: '#111827',
    textLight: '#6B7280',
    background: '#FFFFFF'
  },

  // Features configuration
  features: {
    hasPhoto: false,
    hasIcons: false,
    hasCharts: false,
    atsFriendly: true,
    multiPage: false
  },

  // Photo configuration
  photoConfig: {
    enabled: false,
    style: 'circle',
    position: 'header',
    size: 'medium'
  }
};

export default DEFAULT_TEMPLATE;
