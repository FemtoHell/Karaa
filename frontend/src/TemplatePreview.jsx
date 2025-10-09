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
        const response = await apiRequest(API_ENDPOINTS.TEMPLATE_BY_ID(templateId));
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
  const templateColor = template.gradient.includes('linear-gradient')
    ? '#667eea'
    : template.gradient;

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
            <p>Preview with sample data</p>
          </div>

          <button onClick={handleUseTemplate} className="btn-use-template-primary">
            Use This Template
          </button>
        </div>
      </header>

      {/* Preview Content */}
      <div className="preview-content">
        <div className="resume-preview-container" style={{ '--template-color': templateColor }}>
          {/* Resume Header */}
          <div className="resume-header" style={{ background: template.gradient }}>
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
            <h2 className="section-title">Professional Summary</h2>
            <p className="summary-text">{sampleData.personal.summary}</p>
          </div>

          {/* Experience */}
          <div className="resume-section">
            <h2 className="section-title">Work Experience</h2>
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
            <h2 className="section-title">Education</h2>
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
            <h2 className="section-title">Skills</h2>
            <div className="skills-container">
              {sampleData.skills.technical.length > 0 && (
                <div className="skill-category">
                  <h4>Technical Skills</h4>
                  <div className="skill-tags">
                    {sampleData.skills.technical.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {sampleData.skills.soft.length > 0 && (
                <div className="skill-category">
                  <h4>Soft Skills</h4>
                  <div className="skill-tags">
                    {sampleData.skills.soft.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {sampleData.skills.languages.length > 0 && (
                <div className="skill-category">
                  <h4>Languages</h4>
                  <div className="skill-tags">
                    {sampleData.skills.languages.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          {sampleData.projects.length > 0 && (
            <div className="resume-section">
              <h2 className="section-title">Projects</h2>
              {sampleData.projects.map(project => (
                <div key={project.id} className="project-item">
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <p className="project-tech"><strong>Technologies:</strong> {project.technologies}</p>
                  {project.link && <a href={`https://${project.link}`} className="project-link">{project.link}</a>}
                </div>
              ))}
            </div>
          )}

          {/* Certificates */}
          {sampleData.certificates.length > 0 && (
            <div className="resume-section">
              <h2 className="section-title">Certifications</h2>
              {sampleData.certificates.map(cert => (
                <div key={cert.id} className="certificate-item">
                  <div className="certificate-header">
                    <h3 className="certificate-name">{cert.name}</h3>
                    <span className="certificate-date">{new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="certificate-issuer">{cert.issuer}</p>
                  {cert.description && <p className="certificate-description">{cert.description}</p>}
                </div>
              ))}
            </div>
          )}
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
