import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './TemplatePreview.css';

const TemplatePreview = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const navigate = useNavigate();

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

  // Template configurations
  const templates = {
    1: { name: 'Modern Blue', color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #9333EA 70.71%)' },
    2: { name: 'Modern Green', color: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 70.71%)' },
    3: { name: 'Modern Purple', color: '#A855F7', gradient: 'linear-gradient(135deg, #A855F7 0%, #DB2777 70.71%)' },
    4: { name: 'Modern Orange', color: '#F97316', gradient: 'linear-gradient(135deg, #F97316 0%, #DC2626 70.71%)' },
    5: { name: 'Corporate Elite', color: '#6B7280', gradient: '#F3F4F6' },
    6: { name: 'Business Blue', color: '#3B82F6', gradient: '#EFF6FF' },
    7: { name: 'Professional Green', color: '#10B981', gradient: '#F0FDF4' },
    8: { name: 'Executive', color: '#4F46E5', gradient: '#EEF2FF' },
    9: { name: 'Creative Burst', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 70.71%)' },
    10: { name: 'Creative Red', color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 70.71%)' },
    11: { name: 'Creative Minimal', color: '#6B7280', gradient: 'linear-gradient(135deg, #6B7280 0%, #374151 70.71%)' },
    12: { name: 'Minimal Clean', color: '#6B7280', gradient: '#F9FAFB' },
    13: { name: 'Minimal Blue', color: '#3B82F6', gradient: '#F8FAFC' }
  };

  const currentTemplate = templates[templateId] || templates[1];

  const handleUseTemplate = () => {
    navigate(`/editor?template=${templateId}&action=use`);
  };

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
            <h1>{currentTemplate.name}</h1>
            <p>Preview with sample data</p>
          </div>

          <button onClick={handleUseTemplate} className="btn-use-template-primary">
            Use This Template
          </button>
        </div>
      </header>

      {/* Preview Content */}
      <div className="preview-content">
        <div className="resume-preview-container" style={{ '--template-color': currentTemplate.color }}>
          {/* Resume Header */}
          <div className="resume-header" style={{ background: currentTemplate.gradient }}>
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
