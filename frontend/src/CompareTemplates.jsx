import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CompareTemplates.css';
import { API_ENDPOINTS, apiRequest } from './config/api';
import ResumePreview from './components/ResumePreview';

const CompareTemplates = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [allTemplates, setAllTemplates] = useState([]);
  const [selectedTemplate1, setSelectedTemplate1] = useState(null);
  const [selectedTemplate2, setSelectedTemplate2] = useState(null);
  const [template1Data, setTemplate1Data] = useState(null);
  const [template2Data, setTemplate2Data] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample CV data - shared between both templates
  const sampleData = {
    personal: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.com',
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
        description: 'Professional level certification for designing distributed systems on AWS'
      }
    ],
    activities: [
      {
        id: 1,
        title: 'Open Source Contributor',
        organization: 'React Community',
        startDate: '2020-01',
        current: true,
        description: 'Active contributor to React ecosystem projects, focusing on accessibility improvements'
      }
    ]
  };

  // Fetch all templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(API_ENDPOINTS.TEMPLATES);
        if (response.success) {
          setAllTemplates(response.data);
          
          // Auto-select from URL params
          const t1 = searchParams.get('t1');
          const t2 = searchParams.get('t2');
          
          if (t1) setSelectedTemplate1(t1);
          if (t2) setSelectedTemplate2(t2);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
    // eslint-disable-next-line
  }, []);

  // Fetch template 1 details
  useEffect(() => {
    if (!selectedTemplate1) {
      setTemplate1Data(null);
      return;
    }

    const fetchTemplate = async () => {
      try {
        const response = await apiRequest(API_ENDPOINTS.TEMPLATE_BY_ID(selectedTemplate1));
        if (response.success) {
          setTemplate1Data(response.data);
        }
      } catch (error) {
        console.error('Error fetching template 1:', error);
      }
    };

    fetchTemplate();
  }, [selectedTemplate1]);

  // Fetch template 2 details
  useEffect(() => {
    if (!selectedTemplate2) {
      setTemplate2Data(null);
      return;
    }

    const fetchTemplate = async () => {
      try {
        const response = await apiRequest(API_ENDPOINTS.TEMPLATE_BY_ID(selectedTemplate2));
        if (response.success) {
          setTemplate2Data(response.data);
        }
      } catch (error) {
        console.error('Error fetching template 2:', error);
      }
    };

    fetchTemplate();
  }, [selectedTemplate2]);

  const handleTemplateChange = (position, templateId) => {
    if (position === 1) {
      setSelectedTemplate1(templateId);
    } else {
      setSelectedTemplate2(templateId);
    }
  };

  const handleUseTemplate = (templateId) => {
    navigate(`/editor?template=${templateId}`);
  };

  if (loading) {
    return (
      <div className="compare-templates-loading">
        <div className="spinner"></div>
        <p>Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="compare-templates-page">
      <header className="compare-templates-header">
        <div className="compare-templates-header-content">
          <button className="compare-templates-btn-back" onClick={() => navigate('/templates')}>
            ← Back to Templates
          </button>
          <h1>Compare Templates</h1>
          <p>Choose two templates to compare side-by-side with sample data</p>
        </div>
      </header>

      <div className="compare-templates-main">
        {/* Template Selectors */}
        <div className="compare-templates-selectors">
          <div className="compare-templates-selector-group">
            <label>Template 1:</label>
            <select
              value={selectedTemplate1 || ''}
              onChange={(e) => handleTemplateChange(1, e.target.value)}
            >
              <option value="">Select a template...</option>
              {allTemplates.map((template) => (
                <option
                  key={template._id}
                  value={template._id}
                  disabled={selectedTemplate2 === template._id}
                >
                  {template.name}
                  {selectedTemplate2 === template._id ? ' (Already selected)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="compare-templates-vs-divider">VS</div>

          <div className="compare-templates-selector-group">
            <label>Template 2:</label>
            <select
              value={selectedTemplate2 || ''}
              onChange={(e) => handleTemplateChange(2, e.target.value)}
            >
              <option value="">Select a template...</option>
              {allTemplates.map((template) => (
                <option
                  key={template._id}
                  value={template._id}
                  disabled={selectedTemplate1 === template._id}
                >
                  {template.name}
                  {selectedTemplate1 === template._id ? ' (Already selected)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Grid */}
        {selectedTemplate1 && selectedTemplate2 ? (
          <div className="compare-templates-grid">
            {/* Template 1 Preview */}
            <div className="compare-template-preview-container">
              <div className="compare-template-preview-header">
                <div className="compare-template-info">
                  <h3>{template1Data?.name || 'Loading...'}</h3>
                  <p>{template1Data?.description}</p>
                  {template1Data?.tags && (
                    <div className="compare-template-tags">
                      {template1Data.tags.map((tag, idx) => (
                        <span key={idx} className="compare-template-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="compare-btn-use-template"
                  onClick={() => handleUseTemplate(selectedTemplate1)}
                >
                  Use This Template
                </button>
              </div>
              <div className="compare-template-preview-wrapper">
                {template1Data && (
                  <ResumePreview
                    cvData={sampleData}
                    customization={{
                      font: template1Data.config?.fontFamily || 'Inter',
                      fontSize: template1Data.config?.fontSize || 'medium',
                      colorScheme: template1Data.color || 'blue',
                      spacing: template1Data.config?.spacing || 'normal',
                      layout: template1Data.config?.layout || 'single-column'
                    }}
                    template={{
                      name: template1Data.name,
                      color: template1Data.color,
                      gradient: template1Data.gradient
                    }}
                  />
                )}
              </div>
            </div>

            {/* Template 2 Preview */}
            <div className="compare-template-preview-container">
              <div className="compare-template-preview-header">
                <div className="compare-template-info">
                  <h3>{template2Data?.name || 'Loading...'}</h3>
                  <p>{template2Data?.description}</p>
                  {template2Data?.tags && (
                    <div className="compare-template-tags">
                      {template2Data.tags.map((tag, idx) => (
                        <span key={idx} className="compare-template-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="compare-btn-use-template"
                  onClick={() => handleUseTemplate(selectedTemplate2)}
                >
                  Use This Template
                </button>
              </div>
              <div className="compare-template-preview-wrapper">
                {template2Data && (
                  <ResumePreview
                    cvData={sampleData}
                    customization={{
                      font: template2Data.config?.fontFamily || 'Inter',
                      fontSize: template2Data.config?.fontSize || 'medium',
                      colorScheme: template2Data.color || 'blue',
                      spacing: template2Data.config?.spacing || 'normal',
                      layout: template2Data.config?.layout || 'single-column'
                    }}
                    template={{
                      name: template2Data.name,
                      color: template2Data.color,
                      gradient: template2Data.gradient
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="compare-templates-no-selection">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M16 24h32M16 32h32M16 40h20" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
              <rect x="8" y="12" width="48" height="44" rx="4" stroke="#9CA3AF" strokeWidth="2"/>
            </svg>
            <h3>Select Two Templates to Compare</h3>
            <p>Choose templates from the dropdowns above to see them side-by-side</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareTemplates;
