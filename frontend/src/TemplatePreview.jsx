import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './TemplatePreview.css';
import { API_ENDPOINTS, apiRequest } from './config/api';

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

  // Extract color from gradient for use as accent
  const templateColor = template.gradient?.includes('linear-gradient')
    ? template.colors?.primary || '#667eea'
    : template.gradient;

  // Get layout type
  const layoutType = template.layout?.type || 'single-column';
  const hasPhoto = template.features?.hasPhoto || false;
  const photoStyle = template.config?.photoStyle || 'circle'; // circle, rounded, square

  // Render layout based on type
  const renderLayout = () => {
    switch (layoutType) {
      case 'two-column':
        return renderTwoColumnLayout();
      case 'two-column-equal':
        return renderTwoColumnEqualLayout();
      case 'timeline':
        return renderTimelineLayout();
      case 'modern-blocks':
        return renderModernBlocksLayout();
      case 'infographic':
        return renderInfographicLayout();
      case 'grid':
        return renderGridLayout();
      case 'single-column':
      default:
        return renderSingleColumnLayout();
    }
  };

  // Single Column Layout (Default)
  const renderSingleColumnLayout = () => (
    <>
      <div className="resume-header" style={{ background: template.gradient }}>
        {hasPhoto && (
          <div className={`resume-photo resume-photo-${photoStyle}`}>
            <img src={sampleData.personal.photo} alt={sampleData.personal.fullName} />
          </div>
        )}
        <h1 className="resume-name">{sampleData.personal.fullName}</h1>
        <div className="resume-contact">
          <span>{sampleData.personal.email}</span>
          <span>•</span>
          <span>{sampleData.personal.phone}</span>
          <span>•</span>
          <span>{sampleData.personal.location}</span>
        </div>
        <div className="resume-links">
          <a href={`https://${sampleData.personal.linkedin}`}>{sampleData.personal.linkedin}</a>
          <span>•</span>
          <a href={`https://${sampleData.personal.website}`}>{sampleData.personal.website}</a>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="resume-section">
        <h2 className="section-title" style={{ color: template.colors?.primary }}>Professional Summary</h2>
        <p className="summary-text">{sampleData.personal.summary}</p>
      </div>

      {/* Experience */}
      <div className="resume-section">
        <h2 className="section-title" style={{ color: template.colors?.primary }}>Work Experience</h2>
        {sampleData.experience.map(exp => (
          <div key={exp.id} className="experience-item">
            <div className="experience-header">
              <div>
                <h3 className="job-title">{exp.jobTitle}</h3>
                <p className="company-name">{exp.company} • {exp.location}</p>
              </div>
              <div className="date-range">
                {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="experience-description">
              {exp.description.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="resume-section">
        <h2 className="section-title" style={{ color: template.colors?.primary }}>Education</h2>
        {sampleData.education.map(edu => (
          <div key={edu.id} className="education-item">
            <div className="education-header">
              <div>
                <h3 className="degree-name">{edu.degree}</h3>
                <p className="school-name">{edu.school} • {edu.location}</p>
              </div>
              <div className="date-range">
                {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
            {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
            {edu.description && <p className="education-description">{edu.description}</p>}
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="resume-section">
        <h2 className="section-title" style={{ color: template.colors?.primary }}>Skills</h2>
        <div className="skills-container">
          <div className="skill-tags">
            {sampleData.skills.technical.map((skill, i) => (
              <span key={i} className="skill-tag" style={{ 
                borderColor: template.colors?.primary,
                color: template.colors?.primary 
              }}>{skill}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Projects */}
      {sampleData.projects.length > 0 && (
        <div className="resume-section">
          <h2 className="section-title" style={{ color: template.colors?.primary }}>Projects</h2>
          {sampleData.projects.map(project => (
            <div key={project.id} className="project-item">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-description">{project.description}</p>
              <p className="project-tech"><strong>Technologies:</strong> {project.technologies}</p>
              {project.link && <a href={`https://${project.link}`} className="project-link" style={{ color: template.colors?.primary }}>{project.link}</a>}
            </div>
          ))}
        </div>
      )}
    </>
  );

  // Two Column Layout (30/70 Sidebar)
  const renderTwoColumnLayout = () => (
    <div className="resume-two-column">
      <aside className="resume-sidebar" style={{ 
        backgroundColor: template.colors?.sidebarBg || '#F3F4F6',
        width: template.layout?.columns?.widths[0] || '30%'
      }}>
        {hasPhoto && (
          <div className={`resume-photo resume-photo-${photoStyle}`} style={{ marginBottom: '20px' }}>
            <img src={sampleData.personal.photo} alt={sampleData.personal.fullName} />
          </div>
        )}
        <div className="sidebar-section">
          <h1 className="sidebar-name" style={{ color: template.colors?.primary }}>{sampleData.personal.fullName}</h1>
          <p className="sidebar-contact">{sampleData.personal.email}</p>
          <p className="sidebar-contact">{sampleData.personal.phone}</p>
          <p className="sidebar-contact">{sampleData.personal.location}</p>
        </div>
        
        <div className="sidebar-section">
          <h2 className="sidebar-title" style={{ color: template.colors?.primary }}>Skills</h2>
          <div className="sidebar-skills">
            {sampleData.skills.technical.slice(0, 6).map((skill, i) => (
              <div key={i} className="skill-item">
                <span className="skill-name">{skill}</span>
                <div className="skill-bar-container">
                  <div className="skill-bar" style={{ 
                    width: `${85 - i * 5}%`,
                    backgroundColor: template.colors?.primary 
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
      
      <main className="resume-main" style={{ width: template.layout?.columns?.widths[1] || '70%' }}>
        <div className="resume-section">
          <h2 className="section-title" style={{ color: template.colors?.primary }}>Professional Summary</h2>
          <p className="summary-text">{sampleData.personal.summary}</p>
        </div>

        <div className="resume-section">
          <h2 className="section-title" style={{ color: template.colors?.primary }}>Work Experience</h2>
          {sampleData.experience.map(exp => (
            <div key={exp.id} className="experience-item">
              <div className="experience-header">
                <div>
                  <h3 className="job-title">{exp.jobTitle}</h3>
                  <p className="company-name">{exp.company}</p>
                </div>
                <div className="date-range" style={{ color: template.colors?.textLight }}>
                  {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present
                </div>
              </div>
              <div className="experience-description">
                {exp.description.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="resume-section">
          <h2 className="section-title" style={{ color: template.colors?.primary }}>Education</h2>
          {sampleData.education.map(edu => (
            <div key={edu.id} className="education-item">
              <h3 className="degree-name">{edu.degree}</h3>
              <p className="school-name">{edu.school}</p>
              <p className="gpa">GPA: {edu.gpa}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  // Two Column Equal Layout (50/50)
  const renderTwoColumnEqualLayout = () => (
    <div className="resume-two-column-equal">
      <div className="resume-column-left" style={{ width: '48%' }}>
        <div className="resume-header-compact" style={{ background: template.gradient, padding: '30px 20px' }}>
          {hasPhoto && (
            <div className={`resume-photo resume-photo-${photoStyle}`}>
              <img src={sampleData.personal.photo} alt={sampleData.personal.fullName} />
            </div>
          )}
          <h1 className="resume-name" style={{ color: '#FFFFFF' }}>{sampleData.personal.fullName}</h1>
          <p style={{ color: '#FFFFFF', opacity: 0.9 }}>{sampleData.personal.email}</p>
        </div>
        
        <div className="resume-section">
          <h2 className="section-title" style={{ color: template.colors?.primary }}>Skills</h2>
          <div className="skill-tags">
            {sampleData.skills.technical.map((skill, i) => (
              <span key={i} className="skill-tag" style={{ 
                borderColor: template.colors?.primary,
                color: template.colors?.primary 
              }}>{skill}</span>
            ))}
          </div>
        </div>

        <div className="resume-section">
          <h2 className="section-title" style={{ color: template.colors?.primary }}>Education</h2>
          {sampleData.education.map(edu => (
            <div key={edu.id} className="education-item">
              <h3 className="degree-name">{edu.degree}</h3>
              <p className="school-name">{edu.school}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="resume-column-right" style={{ width: '48%' }}>
        <div className="resume-section" style={{ marginTop: '20px' }}>
          <h2 className="section-title" style={{ color: template.colors?.primary }}>Experience</h2>
          {sampleData.experience.map(exp => (
            <div key={exp.id} className="experience-item">
              <h3 className="job-title">{exp.jobTitle}</h3>
              <p className="company-name">{exp.company}</p>
              <p className="date-range" style={{ color: template.colors?.textLight }}>
                {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric' })} - Present
              </p>
              <p className="experience-description">{exp.description.split('\n')[0]}</p>
            </div>
          ))}
        </div>

        <div className="resume-section">
          <h2 className="section-title" style={{ color: template.colors?.primary }}>Projects</h2>
          {sampleData.projects.map(project => (
            <div key={project.id} className="project-item">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-description">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Timeline Layout
  const renderTimelineLayout = () => (
    <>
      <div className="resume-header" style={{ background: template.gradient }}>
        {hasPhoto && (
          <div className={`resume-photo resume-photo-${photoStyle}`}>
            <img src={sampleData.personal.photo} alt={sampleData.personal.fullName} />
          </div>
        )}
        <h1 className="resume-name">{sampleData.personal.fullName}</h1>
        <p className="resume-contact" style={{ color: '#FFFFFF', opacity: 0.95 }}>
          {sampleData.personal.email} • {sampleData.personal.phone}
        </p>
      </div>

      <div className="resume-section">
        <h2 className="section-title" style={{ color: template.colors?.primary }}>Professional Summary</h2>
        <p className="summary-text">{sampleData.personal.summary}</p>
      </div>

      <div className="resume-section">
        <h2 className="section-title" style={{ color: template.colors?.primary }}>Career Timeline</h2>
        <div className="timeline-container">
          {sampleData.experience.map((exp, index) => (
            <div key={exp.id} className="timeline-item">
              <div className="timeline-marker" style={{ backgroundColor: template.colors?.primary }}>
                <div className="timeline-dot"></div>
              </div>
              <div className="timeline-content">
                <div className="timeline-date" style={{ color: template.colors?.primary }}>
                  {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present
                </div>
                <h3 className="timeline-title">{exp.jobTitle}</h3>
                <p className="timeline-company">{exp.company} • {exp.location}</p>
                <p className="timeline-description">{exp.description.split('\n')[0]}</p>
              </div>
            </div>
          ))}
          {sampleData.education.map((edu, index) => (
            <div key={edu.id} className="timeline-item">
              <div className="timeline-marker" style={{ backgroundColor: template.colors?.secondary }}>
                <div className="timeline-dot"></div>
              </div>
              <div className="timeline-content">
                <div className="timeline-date" style={{ color: template.colors?.secondary }}>
                  {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' })} - {new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' })}
                </div>
                <h3 className="timeline-title">{edu.degree}</h3>
                <p className="timeline-company">{edu.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="resume-section">
        <h2 className="section-title" style={{ color: template.colors?.primary }}>Skills</h2>
        <div className="skill-tags">
          {sampleData.skills.technical.map((skill, i) => (
            <span key={i} className="skill-tag" style={{ 
              borderColor: template.colors?.primary,
              color: template.colors?.primary 
            }}>{skill}</span>
          ))}
        </div>
      </div>
    </>
  );

  // Modern Blocks Layout
  const renderModernBlocksLayout = () => (
    <>
      <div className="resume-header-hero" style={{ background: template.gradient, padding: '60px 40px', textAlign: 'center' }}>
        {hasPhoto && (
          <div className={`resume-photo resume-photo-${photoStyle}`} style={{ margin: '0 auto 20px' }}>
            <img src={sampleData.personal.photo} alt={sampleData.personal.fullName} />
          </div>
        )}
        <h1 className="resume-name" style={{ color: '#FFFFFF', fontSize: '42px' }}>{sampleData.personal.fullName}</h1>
        <p style={{ color: '#FFFFFF', opacity: 0.95, fontSize: '16px', marginTop: '10px' }}>
          {sampleData.personal.email} • {sampleData.personal.phone} • {sampleData.personal.location}
        </p>
      </div>

      <div className="blocks-container" style={{ padding: '30px' }}>
        <div className="block-card" style={{ 
          borderLeft: `4px solid ${template.colors?.primary}`,
          backgroundColor: '#FFFFFF',
          padding: '25px',
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 className="section-title" style={{ color: template.colors?.primary, marginTop: 0 }}>Professional Summary</h2>
          <p className="summary-text">{sampleData.personal.summary}</p>
        </div>

        <div className="block-card" style={{ 
          borderLeft: `4px solid ${template.colors?.primary}`,
          backgroundColor: '#FFFFFF',
          padding: '25px',
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 className="section-title" style={{ color: template.colors?.primary, marginTop: 0 }}>Work Experience</h2>
          {sampleData.experience.map(exp => (
            <div key={exp.id} className="experience-item" style={{ marginBottom: '15px' }}>
              <h3 className="job-title">{exp.jobTitle}</h3>
              <p className="company-name">{exp.company}</p>
              <p className="experience-description">{exp.description.split('\n')[0]}</p>
            </div>
          ))}
        </div>

        <div className="block-row" style={{ display: 'flex', gap: '20px' }}>
          <div className="block-card" style={{ 
            flex: 1,
            borderLeft: `4px solid ${template.colors?.secondary}`,
            backgroundColor: '#FFFFFF',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 className="section-title" style={{ color: template.colors?.secondary, marginTop: 0 }}>Skills</h2>
            <div className="skill-tags">
              {sampleData.skills.technical.map((skill, i) => (
                <span key={i} className="skill-tag" style={{ 
                  borderColor: template.colors?.primary,
                  color: template.colors?.primary,
                  fontSize: '12px',
                  padding: '4px 12px'
                }}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="block-card" style={{ 
            flex: 1,
            borderLeft: `4px solid ${template.colors?.secondary}`,
            backgroundColor: '#FFFFFF',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 className="section-title" style={{ color: template.colors?.secondary, marginTop: 0 }}>Education</h2>
            {sampleData.education.map(edu => (
              <div key={edu.id}>
                <h3 className="degree-name">{edu.degree}</h3>
                <p className="school-name">{edu.school}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // Infographic Layout
  const renderInfographicLayout = () => (
    <>
      <div className="infographic-header" style={{ 
        background: template.gradient,
        padding: '50px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: '30px'
      }}>
        {hasPhoto && (
          <div className={`resume-photo resume-photo-${photoStyle}`} style={{ 
            width: '150px',
            height: '150px',
            flexShrink: 0
          }}>
            <img src={sampleData.personal.photo} alt={sampleData.personal.fullName} />
          </div>
        )}
        <div>
          <h1 className="resume-name" style={{ color: '#FFFFFF', fontSize: '38px', marginBottom: '10px' }}>
            {sampleData.personal.fullName}
          </h1>
          <p style={{ color: '#FFFFFF', opacity: 0.95, fontSize: '16px' }}>
            {sampleData.personal.email} • {sampleData.personal.phone}
          </p>
          <p style={{ color: '#FFFFFF', opacity: 0.95, fontSize: '14px', marginTop: '10px' }}>
            {sampleData.personal.summary}
          </p>
        </div>
      </div>

      <div style={{ padding: '30px', backgroundColor: '#F9FAFB' }}>
        <div className="infographic-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="info-card" style={{ 
            backgroundColor: '#FFFFFF',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 className="section-title" style={{ color: template.colors?.primary, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>💼</span> Experience
            </h2>
            {sampleData.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '15px' }}>
                <h3 className="job-title" style={{ fontSize: '16px', fontWeight: '600' }}>{exp.jobTitle}</h3>
                <p className="company-name" style={{ color: template.colors?.textLight }}>{exp.company}</p>
              </div>
            ))}
          </div>

          <div className="info-card" style={{ 
            backgroundColor: '#FFFFFF',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 className="section-title" style={{ color: template.colors?.primary, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🎓</span> Education
            </h2>
            {sampleData.education.map(edu => (
              <div key={edu.id}>
                <h3 className="degree-name" style={{ fontSize: '16px', fontWeight: '600' }}>{edu.degree}</h3>
                <p className="school-name" style={{ color: template.colors?.textLight }}>{edu.school}</p>
              </div>
            ))}
          </div>

          <div className="info-card" style={{ 
            backgroundColor: '#FFFFFF',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            gridColumn: '1 / -1'
          }}>
            <h2 className="section-title" style={{ color: template.colors?.primary, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>⚡</span> Skills
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
              {sampleData.skills.technical.map((skill, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 10px',
                    borderRadius: '50%',
                    border: `4px solid ${template.colors?.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: template.colors?.primary
                  }}>
                    {85 - i * 10}%
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>{skill}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Grid Layout
  const renderGridLayout = () => (
    <>
      <div className="resume-header" style={{ background: template.gradient }}>
        {hasPhoto && (
          <div className={`resume-photo resume-photo-${photoStyle}`}>
            <img src={sampleData.personal.photo} alt={sampleData.personal.fullName} />
          </div>
        )}
        <h1 className="resume-name">{sampleData.personal.fullName}</h1>
        <p style={{ color: '#FFFFFF', opacity: 0.95 }}>{sampleData.personal.email}</p>
      </div>

      <div style={{ padding: '30px' }}>
        <div className="grid-container" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px'
        }}>
          <div className="grid-item" style={{ 
            padding: '20px',
            borderLeft: `3px solid ${template.colors?.primary}`,
            backgroundColor: '#F9FAFB'
          }}>
            <h2 className="section-title" style={{ color: template.colors?.primary }}>Summary</h2>
            <p>{sampleData.personal.summary}</p>
          </div>

          <div className="grid-item" style={{ 
            padding: '20px',
            borderLeft: `3px solid ${template.colors?.primary}`,
            backgroundColor: '#F9FAFB'
          }}>
            <h2 className="section-title" style={{ color: template.colors?.primary }}>Skills</h2>
            <div className="skill-tags">
              {sampleData.skills.technical.slice(0, 5).map((skill, i) => (
                <span key={i} className="skill-tag" style={{ 
                  borderColor: template.colors?.primary,
                  color: template.colors?.primary,
                  fontSize: '11px',
                  padding: '3px 10px'
                }}>{skill}</span>
              ))}
            </div>
          </div>

          <div className="grid-item" style={{ 
            padding: '20px',
            borderLeft: `3px solid ${template.colors?.secondary}`,
            backgroundColor: '#F9FAFB',
            gridColumn: '1 / -1'
          }}>
            <h2 className="section-title" style={{ color: template.colors?.secondary }}>Experience</h2>
            {sampleData.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '15px' }}>
                <h3 className="job-title">{exp.jobTitle}</h3>
                <p className="company-name">{exp.company}</p>
              </div>
            ))}
          </div>

          <div className="grid-item" style={{ 
            padding: '20px',
            borderLeft: `3px solid ${template.colors?.secondary}`,
            backgroundColor: '#F9FAFB'
          }}>
            <h2 className="section-title" style={{ color: template.colors?.secondary }}>Education</h2>
            {sampleData.education.map(edu => (
              <div key={edu.id}>
                <h3 className="degree-name">{edu.degree}</h3>
                <p className="school-name">{edu.school}</p>
              </div>
            ))}
          </div>

          <div className="grid-item" style={{ 
            padding: '20px',
            borderLeft: `3px solid ${template.colors?.secondary}`,
            backgroundColor: '#F9FAFB'
          }}>
            <h2 className="section-title" style={{ color: template.colors?.secondary }}>Projects</h2>
            {sampleData.projects.map(project => (
              <div key={project.id}>
                <h3 className="project-name">{project.name}</h3>
                <p style={{ fontSize: '12px' }}>{project.technologies}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

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
            <p>Preview with sample data • Layout: {layoutType}</p>
          </div>

          <button onClick={handleUseTemplate} className="btn-use-template-primary">
            Use This Template
          </button>
        </div>
      </header>

      {/* Preview Content */}
      <div className="preview-content">
        <div className={`resume-preview-container layout-${layoutType}`} style={{ '--template-color': templateColor }}>
          {renderLayout()}
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
