import React from 'react';
import './ResumePreview.css';

const ResumePreview = ({ cvData, customization, template, editable = false }) => {
  const currentTemplate = template || {
    name: 'Classic',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };

  const getColorValue = (colorName) => {
    const colors = {
      blue: '#3B82F6', purple: '#8B5CF6', green: '#10B981', red: '#EF4444',
      orange: '#F59E0B', teal: '#14B8A6', pink: '#EC4899', gray: '#6B7280'
    };
    return colors[colorName] || '#3B82F6';
  };

  const getSecondaryColor = (colorName) => {
    const colors = {
      blue: '#1E40AF', purple: '#6D28D9', green: '#059669', red: '#DC2626',
      orange: '#D97706', teal: '#0D9488', pink: '#DB2777', gray: '#4B5563'
    };
    return colors[colorName] || '#1E40AF';
  };

  return (
    <div 
      className={`resume-preview-page ${customization?.layout || 'single-column'}`}
      style={{ 
        '--template-color': currentTemplate.color,
        fontFamily: customization?.font || 'Inter, sans-serif',
        fontSize: `${14 * (customization?.fontSize === 'small' ? 0.9 : customization?.fontSize === 'large' ? 1.1 : 1.0)}px`,
        '--primary-color': getColorValue(customization?.colorScheme),
        '--secondary-color': getSecondaryColor(customization?.colorScheme),
        '--spacing-scale': customization?.spacing === 'compact' ? 0.8 : customization?.spacing === 'relaxed' ? 1.2 : 1.0
      }}
    >
      {/* Resume Header */}
      <div className="resume-header-styled" style={{ background: currentTemplate.gradient }}>
        <h1 className="resume-name-styled">
          {cvData?.personal?.fullName || 'Your Name'}
        </h1>
        <div className="resume-contact-styled">
          {cvData?.personal?.email && <span>{cvData.personal.email}</span>}
          {cvData?.personal?.email && cvData?.personal?.phone && <span>•</span>}
          {cvData?.personal?.phone && <span>{cvData.personal.phone}</span>}
          {(cvData?.personal?.email || cvData?.personal?.phone) && cvData?.personal?.location && <span>•</span>}
          {cvData?.personal?.location && <span>{cvData.personal.location}</span>}
        </div>
        <div className="resume-links-styled">
          {cvData?.personal?.linkedin && <span>{cvData.personal.linkedin}</span>}
          {cvData?.personal?.linkedin && cvData?.personal?.website && <span>•</span>}
          {cvData?.personal?.website && <span>{cvData.personal.website}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {cvData?.personal?.summary && (
        <div className="resume-section-styled">
          <h2 className="section-title-styled">Professional Summary</h2>
          <p className="summary-text">{cvData.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {cvData?.experience && cvData.experience.length > 0 && (
        <div className="resume-section-styled">
          <h2 className="section-title-styled">Experience</h2>
          {cvData.experience.map((exp, idx) => (
            <div key={idx} className="resume-item">
              <div className="item-header">
                <div className="item-title-group">
                  <h3 className="item-title">{exp.jobTitle}</h3>
                  <div className="item-subtitle">{exp.company}</div>
                </div>
                <div className="item-date">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.location && <div className="item-location">{exp.location}</div>}
              {exp.description && <p className="item-description">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cvData?.education && cvData.education.length > 0 && (
        <div className="resume-section-styled">
          <h2 className="section-title-styled">Education</h2>
          {cvData.education.map((edu, idx) => (
            <div key={idx} className="resume-item">
              <div className="item-header">
                <div className="item-title-group">
                  <h3 className="item-title">{edu.degree}</h3>
                  <div className="item-subtitle">{edu.school}</div>
                </div>
                <div className="item-date">
                  {edu.startDate} - {edu.endDate}
                </div>
              </div>
              {edu.location && <div className="item-location">{edu.location}</div>}
              {edu.gpa && <div className="item-gpa">GPA: {edu.gpa}</div>}
              {edu.description && <p className="item-description">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {cvData?.skills && (cvData.skills.technical?.length > 0 || cvData.skills.soft?.length > 0 || cvData.skills.languages?.length > 0) && (
        <div className="resume-section-styled">
          <h2 className="section-title-styled">Skills</h2>
          {cvData.skills.technical?.length > 0 && (
            <div className="skills-group">
              <strong>Technical:</strong> {cvData.skills.technical.join(', ')}
            </div>
          )}
          {cvData.skills.soft?.length > 0 && (
            <div className="skills-group">
              <strong>Soft Skills:</strong> {cvData.skills.soft.join(', ')}
            </div>
          )}
          {cvData.skills.languages?.length > 0 && (
            <div className="skills-group">
              <strong>Languages:</strong> {cvData.skills.languages.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {cvData?.projects && cvData.projects.length > 0 && (
        <div className="resume-section-styled">
          <h2 className="section-title-styled">Projects</h2>
          {cvData.projects.map((proj, idx) => (
            <div key={idx} className="resume-item">
              <div className="item-header">
                <div className="item-title-group">
                  <h3 className="item-title">{proj.name}</h3>
                  {proj.technologies && <div className="item-subtitle">{proj.technologies}</div>}
                </div>
                {proj.startDate && (
                  <div className="item-date">
                    {proj.startDate} - {proj.endDate || 'Present'}
                  </div>
                )}
              </div>
              {proj.description && <p className="item-description">{proj.description}</p>}
              {proj.link && <a href={proj.link} className="item-link">{proj.link}</a>}
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {cvData?.certificates && cvData.certificates.length > 0 && (
        <div className="resume-section-styled">
          <h2 className="section-title-styled">Certificates</h2>
          {cvData.certificates.map((cert, idx) => (
            <div key={idx} className="resume-item">
              <div className="item-header">
                <div className="item-title-group">
                  <h3 className="item-title">{cert.name}</h3>
                  {cert.issuer && <div className="item-subtitle">{cert.issuer}</div>}
                </div>
                {cert.date && <div className="item-date">{cert.date}</div>}
              </div>
              {cert.description && <p className="item-description">{cert.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Activities */}
      {cvData?.activities && cvData.activities.length > 0 && (
        <div className="resume-section-styled">
          <h2 className="section-title-styled">Activities & Volunteering</h2>
          {cvData.activities.map((activity, idx) => (
            <div key={idx} className="resume-item">
              <div className="item-header">
                <div className="item-title-group">
                  <h3 className="item-title">{activity.title}</h3>
                  {activity.organization && <div className="item-subtitle">{activity.organization}</div>}
                </div>
                {activity.startDate && (
                  <div className="item-date">
                    {activity.startDate} - {activity.current ? 'Present' : activity.endDate}
                  </div>
                )}
              </div>
              {activity.description && <p className="item-description">{activity.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
