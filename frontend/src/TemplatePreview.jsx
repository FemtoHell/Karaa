import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './TemplatePreview.css';
import { API_ENDPOINTS, apiRequest } from './config/api';
import ResumePreview from './components/ResumePreview';

const TemplatePreview = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample CV data for preview
  const sampleData = {
    personal: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.com',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&q=80',
      summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading engineering teams.'
    },
    experience: [
      {
        id: 1,
        jobTitle: 'Senior Software Engineer',
        company: 'Tech Corp Inc.',
        location: 'New York, NY',
        startDate: '2021-01',
        endDate: 'Present',
        current: true,
        description: '• Led a team of 5 engineers in developing a microservices-based platform\n• Improved application performance by 40% through optimization\n• Mentored junior developers and conducted code reviews'
      },
      {
        id: 2,
        jobTitle: 'Software Engineer',
        company: 'StartUp Labs',
        location: 'San Francisco, CA',
        startDate: '2019-06',
        endDate: '2021-01',
        current: false,
        description: '• Developed RESTful APIs using Node.js and Express\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Collaborated with product team on feature development'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        location: 'Boston, MA',
        startDate: '2015-09',
        endDate: '2019-05',
        gpa: '3.8/4.0',
        description: 'Relevant Coursework: Data Structures, Algorithms, Web Development, Database Systems'
      }
    ],
    skills: {
      technical: ['JavaScript', 'React', 'Node.js', 'Python', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL'],
      soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration'],
      languages: ['English (Native)', 'Spanish (Intermediate)']
    },
    projects: [
      {
        id: 1,
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform with payment integration and real-time inventory management',
        technologies: 'React, Node.js, MongoDB, Stripe API',
        link: 'github.com/johndoe/ecommerce',
        startDate: '2023-01',
        endDate: '2023-06'
      }
    ],
    certificates: [
      {
        id: 1,
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2022-08',
        link: 'aws.amazon.com/certification',
        description: 'Professional level certification for designing distributed systems on AWS'
      }
    ]
  };

  // Fetch template data from API
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        console.log('Fetching template with ID:', templateId);
        
        // Add skipCache=true to get fresh template data and avoid stale cache
        const response = await apiRequest(`${API_ENDPOINTS.TEMPLATE_BY_ID(templateId)}?skipCache=true`);
        console.log('Template response:', response);
        
        if (response.success) {
          setTemplate(response.data);
        } else {
          console.error('Failed to fetch template:', response);
          setTemplate(null);
        }
      } catch (error) {
        console.error('Error fetching template:', error);
        console.error('Error details:', error.message);
        setTemplate(null);
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      fetchTemplate();
    } else {
      console.error('No templateId provided');
      setLoading(false);
    }
  }, [templateId]);

  const handleUseTemplate = () => {
    navigate(`/editor?template=${templateId}&action=use`);
  };

  if (loading) {
    return (
      <div className="template-preview-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading template preview...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="template-preview-page">
        <div className="error-state">
          <p>Template not found</p>
          <button onClick={() => navigate('/templates')} className="btn-primary">
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  // Prepare customization object from template
  const customization = {
    font: template.typography?.headingFont || 'Inter',
    fontSize: 'medium',
    colorScheme: template.category || 'blue',
    spacing: 'normal',
    layout: template.layout?.type || 'single-column',
    templateId: template._id,
    photoStyle: template.photoConfig?.style || 'circle',
    photoPosition: template.photoConfig?.position || 'header'
  };

  // REMOVED: Old hardcoded render functions (lines 160-784)
  // Now using ResumePreview component for consistency

  return (
    <div className="template-preview-page">
      {/* Header */}
      <header className="preview-header">
        <div className="preview-header-content">
          <button onClick={() => navigate('/templates')} className="btn-back">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 18l-8-8 8-8M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Templates</span>
          </button>

          <div className="preview-title">
            <h1>{template.name}</h1>
            <p>Preview with sample data • Layout: {template.layout?.type || 'single-column'}</p>
          </div>

          <button onClick={handleUseTemplate} className="btn-use-template-primary">
            Use This Template
          </button>
        </div>
      </header>

      {/* Preview Content */}
      <div className="preview-content">
        <div className="resume-preview-container">
          <ResumePreview
            cvData={sampleData}
            customization={customization}
            template={template}
            editable={false}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="preview-footer">
        <p>This is a preview with sample data. Click "Use This Template" to customize with your information.</p>
      </div>
    </div>
  );
};

export default TemplatePreview;
