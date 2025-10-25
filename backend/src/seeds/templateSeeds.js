const mongoose = require('mongoose');
const Template = require('../models/Template');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Template seeds - 12 HOÀN TOÀN KHÁC NHAU
const templates = [
  // 1. MODERN MINIMAL (Single Column, ATS-Friendly)
  {
    name: 'Modern Minimal',
    description: 'Clean, ATS-friendly single-column resume perfect for software engineers and developers',
    category: 'modern',
    color: 'blue',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop&q=80',
    tags: ['tech', 'developer', 'modern', 'ats-friendly', 'minimal'],
    popularity: 95,
    views: 5234,
    isActive: true,
    layout: {
      type: 'single-column',
      columns: { count: 1, widths: ['100%'], gap: '0' }
    },
    sections: {
      order: ['personal', 'summary', 'experience', 'education', 'skills', 'projects'],
      visible: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certificates: false,
        activities: false
      },
      config: {
        experience: { showBullets: true, showDuration: true },
        skills: { displayType: 'tags' }
      }
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      sizes: { name: '32px', heading: '18px', subheading: '14px', body: '12px' }
    },
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      text: '#000000',
      textLight: '#666666',
      background: '#FFFFFF'
    },
    features: {
      hasPhoto: false,
      hasIcons: false,
      hasCharts: false,
      atsFriendly: true,
      multiPage: false
    },
    photoConfig: {
      enabled: false,
      style: 'circle',
      position: 'header',
      size: 'medium'
    },
    config: {
      layout: 'single-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Inter',
      photoStyle: 'circle',
      sections: ['personal', 'summary', 'experience', 'education', 'skills', 'projects']
    }
  },
  // 2. TWO-COLUMN PROFESSIONAL (Sidebar + Main)
  {
    name: 'Two-Column Professional',
    description: 'Professional sidebar layout perfect for business, marketing, and sales roles',
    category: 'professional',
    color: 'blue',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=500&fit=crop&q=80',
    tags: ['professional', 'business', 'marketing', 'sidebar', 'modern'],
    popularity: 92,
    views: 6234,
    isActive: true,
    layout: {
      type: 'two-column',
      columns: { count: 2, widths: ['30%', '70%'], gap: '24px' }
    },
    sections: {
      order: ['personal', 'skills', 'languages', 'experience', 'education', 'certificates'],
      visible: {
        personal: true,
        summary: false,
        experience: true,
        education: true,
        skills: true,
        projects: false,
        certificates: true,
        activities: false,
        languages: true
      },
      config: {
        skills: { displayType: 'bars', showProficiency: true, position: 'sidebar' },
        languages: { displayType: 'bars', position: 'sidebar' },
        personal: { position: 'sidebar', showPhoto: true },
        experience: { position: 'main', showBullets: true },
        education: { position: 'main' }
      }
    },
    typography: {
      headingFont: 'Roboto',
      bodyFont: 'Roboto',
      sizes: { name: '28px', heading: '16px', subheading: '13px', body: '11px' }
    },
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      text: '#1F2937',
      textLight: '#6B7280',
      background: '#FFFFFF',
      sidebarBg: '#F3F4F6'
    },
    features: {
      hasPhoto: true,
      hasIcons: true,
      hasCharts: true,
      atsFriendly: false,
      multiPage: false
    },
    photoConfig: {
      enabled: true,
      style: 'rounded',
      position: 'sidebar',
      size: 'medium'
    },
    config: {
      layout: 'two-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Roboto',
      photoStyle: 'rounded',
      photoPosition: 'sidebar',
      sections: ['personal', 'skills', 'languages', 'experience', 'education', 'certificates']
    }
  },
  // 3. CREATIVE PORTFOLIO (Modern Blocks với Photo)
  {
    name: 'Creative Portfolio',
    description: 'Eye-catching portfolio layout for designers, artists and creatives',
    category: 'creative',
    color: 'purple',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=500&fit=crop&q=80',
    tags: ['creative', 'portfolio', 'designer', 'artist', 'colorful'],
    popularity: 88,
    views: 5123,
    isActive: true,
    layout: {
      type: 'modern-blocks',
      columns: { count: 1, widths: ['100%'], gap: '16px' }
    },
    sections: {
      order: ['personal', 'summary', 'projects', 'skills', 'experience', 'education'],
      visible: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certificates: false,
        activities: false
      },
      config: {
        personal: { showPhoto: true, layout: 'hero' },
        projects: { displayType: 'grid', showImages: true },
        skills: { displayType: 'icons' }
      }
    },
    typography: {
      headingFont: 'Montserrat',
      bodyFont: 'Open Sans',
      sizes: { name: '36px', heading: '20px', subheading: '15px', body: '13px' }
    },
    colors: {
      primary: '#F093FB',
      secondary: '#F5576C',
      text: '#1F2937',
      textLight: '#6B7280',
      background: '#FFFFFF'
    },
    features: {
      hasPhoto: true,
      hasIcons: true,
      hasCharts: false,
      atsFriendly: false,
      multiPage: true
    },
    photoConfig: {
      enabled: true,
      style: 'circle',
      position: 'header',
      size: 'large'
    },
    config: {
      layout: 'modern-blocks',
      fontSize: 'medium',
      spacing: 'relaxed',
      fontFamily: 'Montserrat',
      photoStyle: 'circle',
      photoPosition: 'header',
      sections: ['personal', 'summary', 'projects', 'skills', 'experience', 'education']
    }
  },
  // 4. TIMELINE RESUME (Vertical Timeline)
  {
    name: 'Timeline Professional',
    description: 'Timeline-based layout perfect for showing career progression',
    category: 'modern',
    color: 'blue',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=500&fit=crop&q=80',
    tags: ['timeline', 'modern', 'progression', 'visual'],
    popularity: 87,
    views: 4678,
    isActive: true,
    layout: {
      type: 'timeline',
      columns: { count: 1, widths: ['100%'], gap: '0' }
    },
    sections: {
      order: ['personal', 'summary', 'experience', 'education', 'skills'],
      visible: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: false,
        certificates: false
      },
      config: {
        experience: { displayType: 'timeline', showIcons: true },
        education: { displayType: 'timeline' }
      }
    },
    typography: {
      headingFont: 'Raleway',
      bodyFont: 'Lato',
      sizes: { name: '30px', heading: '17px', subheading: '14px', body: '12px' }
    },
    colors: {
      primary: '#667EEA',
      secondary: '#764BA2',
      text: '#111827',
      textLight: '#6B7280',
      background: '#FFFFFF',
      timeline: '#E5E7EB'
    },
    features: {
      hasPhoto: false,
      hasIcons: true,
      hasCharts: false,
      atsFriendly: false,
      multiPage: false
    },
    photoConfig: {
      enabled: false,
      style: 'circle',
      position: 'header',
      size: 'medium'
    },
    config: {
      layout: 'timeline',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Raleway',
      photoStyle: 'circle',
      sections: ['personal', 'summary', 'experience', 'education', 'skills']
    }
  },
  // 5. SPLIT COLUMN (50/50)
  {
    name: 'Split Column Modern',
    description: 'Balanced 50/50 split layout for balanced presentation',
    category: 'modern',
    color: 'green',
    gradient: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=500&fit=crop&q=80',
    tags: ['split', 'modern', 'balanced', 'creative'],
    popularity: 85,
    views: 4321,
    isActive: true,
    layout: {
      type: 'two-column-equal',
      columns: { count: 2, widths: ['50%', '50%'], gap: '20px' }
    },
    sections: {
      order: ['personal', 'skills', 'languages', 'experience', 'education', 'projects'],
      visible: {
        personal: true,
        summary: false,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        languages: true
      },
      config: {
        personal: { position: 'left' },
        skills: { position: 'left', displayType: 'list' },
        languages: { position: 'left' },
        experience: { position: 'right' },
        education: { position: 'right' },
        projects: { position: 'right' }
      }
    },
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      sizes: { name: '28px', heading: '16px', subheading: '13px', body: '11px' }
    },
    colors: {
      primary: '#00B09B',
      secondary: '#96C93D',
      text: '#1F2937',
      textLight: '#6B7280',
      background: '#FFFFFF'
    },
    features: {
      hasPhoto: true,
      hasIcons: false,
      hasCharts: false,
      atsFriendly: false,
      multiPage: false
    },
    photoConfig: {
      enabled: true,
      style: 'square',
      position: 'header',
      size: 'medium'
    },
    config: {
      layout: 'two-column-equal',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Poppins',
      photoStyle: 'square',
      photoPosition: 'header',
      sections: ['personal', 'skills', 'languages', 'experience', 'education', 'projects']
    }
  },
  // 6. SKILLS-FOCUSED RESUME
  {
    name: 'Skills-Focused Professional',
    description: 'Emphasize skills over chronology - perfect for career changers and freelancers',
    category: 'modern',
    color: 'orange',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=500&fit=crop&q=80',
    tags: ['skills', 'career-change', 'freelance', 'modern'],
    popularity: 84,
    views: 3987,
    isActive: true,
    layout: {
      type: 'single-column',
      columns: { count: 1, widths: ['100%'], gap: '0' }
    },
    sections: {
      order: ['personal', 'summary', 'skills', 'projects', 'experience', 'education'],
      visible: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certificates: false
      },
      config: {
        skills: { displayType: 'bars-prominent', showProficiency: true, featured: true },
        projects: { showHighlights: true },
        experience: { brief: true }
      }
    },
    typography: {
      headingFont: 'Nunito',
      bodyFont: 'Roboto',
      sizes: { name: '30px', heading: '18px', subheading: '14px', body: '12px' }
    },
    colors: {
      primary: '#FA709A',
      secondary: '#FEE140',
      text: '#1F2937',
      textLight: '#6B7280',
      background: '#FFFFFF'
    },
    features: {
      hasPhoto: false,
      hasIcons: false,
      hasCharts: true,
      atsFriendly: false,
      multiPage: false
    },
    photoConfig: {
      enabled: false,
      style: 'circle',
      position: 'header',
      size: 'medium'
    },
    config: {
      layout: 'single-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Nunito',
      photoStyle: 'circle',
      sections: ['personal', 'summary', 'skills', 'projects', 'experience', 'education']
    }
  },
  // 7. EXECUTIVE RESUME
  {
    name: 'Executive Leadership',
    description: 'Formal executive template for C-level and senior leadership positions',
    category: 'professional',
    color: 'gray',
    gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop&q=80',
    tags: ['executive', 'leadership', 'c-level', 'formal'],
    popularity: 90,
    views: 5234,
    isActive: true,
    layout: {
      type: 'single-column',
      columns: { count: 1, widths: ['100%'], gap: '0' }
    },
    sections: {
      order: ['personal', 'summary', 'experience', 'education', 'awards', 'publications'],
      visible: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: false,
        projects: false,
        awards: true,
        publications: true
      },
      config: {
        summary: { type: 'executive' },
        experience: { showMetrics: true, showImpact: true },
        education: { showExecutiveEd: true }
      }
    },
    typography: {
      headingFont: 'Merriweather',
      bodyFont: 'Georgia',
      sizes: { name: '32px', heading: '18px', subheading: '15px', body: '13px' }
    },
    colors: {
      primary: '#1F2937',
      secondary: '#4B5563',
      text: '#000000',
      textLight: '#6B7280',
      background: '#FFFFFF'
    },
    features: {
      hasPhoto: false,
      hasIcons: false,
      hasCharts: false,
      atsFriendly: true,
      multiPage: true
    },
    photoConfig: {
      enabled: false,
      style: 'circle',
      position: 'header',
      size: 'medium'
    },
    config: {
      layout: 'single-column',
      fontSize: 'large',
      spacing: 'relaxed',
      fontFamily: 'Merriweather',
      photoStyle: 'circle',
      sections: ['personal', 'summary', 'experience', 'education', 'awards', 'publications']
    }
  },
  // 8. INFOGRAPHIC RESUME
  {
    name: 'Infographic Visual',
    description: 'Eye-catching infographic layout with charts and visual elements',
    category: 'creative',
    color: 'blue',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=500&fit=crop&q=80',
    tags: ['infographic', 'visual', 'creative', 'charts'],
    popularity: 83,
    views: 4123,
    isActive: true,
    layout: {
      type: 'infographic',
      columns: { count: 1, widths: ['100%'], gap: '16px' }
    },
    sections: {
      order: ['personal', 'skills', 'experience', 'education', 'projects'],
      visible: {
        personal: true,
        summary: false,
        experience: true,
        education: true,
        skills: true,
        projects: true
      },
      config: {
        personal: { showPhoto: true, showMetrics: true },
        skills: { displayType: 'charts', showRatings: true },
        experience: { displayType: 'icons', showMetrics: true }
      }
    },
    typography: {
      headingFont: 'Oswald',
      bodyFont: 'Lato',
      sizes: { name: '34px', heading: '20px', subheading: '16px', body: '13px' }
    },
    colors: {
      primary: '#667EEA',
      secondary: '#764BA2',
      text: '#1F2937',
      textLight: '#6B7280',
      background: '#F9FAFB'
    },
    features: {
      hasPhoto: true,
      hasIcons: true,
      hasCharts: true,
      atsFriendly: false,
      multiPage: false
    },
    photoConfig: {
      enabled: true,
      style: 'rounded',
      position: 'header',
      size: 'large'
    },
    config: {
      layout: 'infographic',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Oswald',
      photoStyle: 'rounded',
      photoPosition: 'header',
      sections: ['personal', 'skills', 'experience', 'education', 'projects']
    }
  },
  // 9. ACADEMIC CV
  {
    name: 'Academic CV',
    description: 'Comprehensive academic CV for researchers, professors and academics',
    category: 'professional',
    color: 'gray',
    gradient: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop&q=80',
    tags: ['academic', 'research', 'professor', 'cv'],
    popularity: 79,
    views: 2987,
    isActive: true,
    layout: {
      type: 'single-column',
      columns: { count: 1, widths: ['100%'], gap: '0' }
    },
    sections: {
      order: ['personal', 'education', 'publications', 'experience', 'awards', 'references'],
      visible: {
        personal: true,
        summary: false,
        experience: true,
        education: true,
        skills: false,
        projects: false,
        publications: true,
        awards: true,
        references: true
      },
      config: {
        education: { showThesis: true },
        publications: { showCitations: true, showDOI: true },
        experience: { showTeaching: true, showResearch: true }
      }
    },
    typography: {
      headingFont: 'Times New Roman',
      bodyFont: 'Times New Roman',
      sizes: { name: '28px', heading: '16px', subheading: '14px', body: '12px' }
    },
    colors: {
      primary: '#1F2937',
      secondary: '#4B5563',
      text: '#000000',
      textLight: '#374151',
      background: '#FFFFFF'
    },
    features: {
      hasPhoto: false,
      hasIcons: false,
      hasCharts: false,
      atsFriendly: true,
      multiPage: true
    },
    photoConfig: {
      enabled: false,
      style: 'square',
      position: 'header',
      size: 'small'
    },
    config: {
      layout: 'single-column',
      fontSize: 'small',
      spacing: 'compact',
      fontFamily: 'Times New Roman',
      photoStyle: 'square',
      sections: ['personal', 'education', 'publications', 'experience', 'awards', 'references']
    }
  },
  // 10. SIMPLE ATS-FRIENDLY
  {
    name: 'Simple ATS-Friendly',
    description: 'Plain, machine-readable format optimized for ATS systems',
    category: 'minimalist',
    color: 'purple',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=500&fit=crop&q=80',
    tags: ['ats', 'simple', 'minimal', 'job-application'],
    popularity: 92,
    views: 6123,
    isActive: true,
    layout: {
      type: 'single-column',
      columns: { count: 1, widths: ['100%'], gap: '0' }
    },
    sections: {
      order: ['personal', 'summary', 'experience', 'education', 'skills'],
      visible: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: false,
        certificates: false
      },
      config: {
        personal: { plain: true, noFormatting: true },
        experience: { plainBullets: true },
        skills: { displayType: 'comma-separated' }
      }
    },
    typography: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      sizes: { name: '24px', heading: '14px', subheading: '12px', body: '11px' }
    },
    colors: {
      primary: '#000000',
      secondary: '#333333',
      text: '#000000',
      textLight: '#666666',
      background: '#FFFFFF'
    },
    features: {
      hasPhoto: false,
      hasIcons: false,
      hasCharts: false,
      atsFriendly: true,
      multiPage: false
    },
    photoConfig: {
      enabled: false,
      style: 'square',
      position: 'header',
      size: 'small'
    },
    config: {
      layout: 'single-column',
      fontSize: 'small',
      spacing: 'compact',
      fontFamily: 'Arial',
      photoStyle: 'square',
      sections: ['personal', 'summary', 'experience', 'education', 'skills']
    }
  },
  // 11. COMPACT ONE-PAGE
  {
    name: 'Compact One-Page',
    description: 'Maximize content in one page - perfect for entry-level and internships',
    category: 'minimalist',
    color: 'blue',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=500&fit=crop&q=80',
    tags: ['compact', 'one-page', 'entry-level', 'internship'],
    popularity: 88,
    views: 5234,
    isActive: true,
    layout: {
      type: 'single-column',
      columns: { count: 1, widths: ['100%'], gap: '0' }
    },
    sections: {
      order: ['personal', 'education', 'projects', 'skills', 'experience'],
      visible: {
        personal: true,
        summary: false,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certificates: false
      },
      config: {
        personal: { compact: true },
        education: { showGPA: true },
        projects: { priority: 'high' },
        skills: { displayType: 'inline' }
      }
    },
    typography: {
      headingFont: 'Roboto',
      bodyFont: 'Roboto',
      sizes: { name: '26px', heading: '15px', subheading: '12px', body: '10px' }
    },
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      text: '#1F2937',
      textLight: '#6B7280',
      background: '#FFFFFF'
    },
    features: {
      hasPhoto: true,
      hasIcons: false,
      hasCharts: false,
      atsFriendly: true,
      multiPage: false
    },
    photoConfig: {
      enabled: true,
      style: 'circle',
      position: 'header',
      size: 'small'
    },
    config: {
      layout: 'single-column',
      fontSize: 'small',
      spacing: 'compact',
      fontFamily: 'Roboto',
      photoStyle: 'circle',
      photoPosition: 'header',
      sections: ['personal', 'education', 'projects', 'skills', 'experience']
    }
  },
  // 12. MODERN GRADIENT
  {
    name: 'Modern Gradient',
    description: 'Eye-catching gradient header with modern clean body',
    category: 'modern',
    color: 'purple',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=500&fit=crop&q=80',
    tags: ['modern', 'gradient', 'colorful', 'creative'],
    popularity: 89,
    views: 5678,
    isActive: true,
    layout: {
      type: 'single-column',
      columns: { count: 1, widths: ['100%'], gap: '0' }
    },
    sections: {
      order: ['personal', 'summary', 'experience', 'skills', 'education', 'projects'],
      visible: {
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certificates: false
      },
      config: {
        personal: { layout: 'gradient-header', showPhoto: true },
        experience: { showCards: true },
        skills: { displayType: 'tags-colored' }
      }
    },
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Open Sans',
      sizes: { name: '32px', heading: '18px', subheading: '14px', body: '12px' }
    },
    colors: {
      primary: '#667EEA',
      secondary: '#764BA2',
      text: '#1F2937',
      textLight: '#6B7280',
      background: '#FFFFFF',
      headerGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    features: {
      hasPhoto: true,
      hasIcons: true,
      hasCharts: false,
      atsFriendly: false,
      multiPage: false
    },
    photoConfig: {
      enabled: true,
      style: 'circle',
      position: 'header',
      size: 'large'
    },
    config: {
      layout: 'single-column',
      fontSize: 'medium',
      spacing: 'normal',
      fontFamily: 'Poppins',
      photoStyle: 'circle',
      photoPosition: 'header',
      sections: ['personal', 'summary', 'experience', 'skills', 'education', 'projects']
    }
  }
];

// Import function
const importTemplates = async () => {
  try {
    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    const insertedTemplates = await Template.insertMany(templates);
    console.log(`✅ Successfully imported ${insertedTemplates.length} templates`);

    // Display summary
    console.log('\n📊 Template Summary:');
    const categories = await Template.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    categories.forEach(cat => {
      console.log(`  - ${cat._id}: ${cat.count} templates`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing templates:', error);
    process.exit(1);
  }
};

// Run import
importTemplates();
