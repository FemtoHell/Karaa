import React from 'react';
import './MiniTemplatePreview.css';

const MiniTemplatePreview = ({ template }) => {
  // Sample minimal data for mini preview
  const sampleData = {
    personal: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234-567-8900',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.com',
      summary: 'Experienced professional with expertise in modern technologies and proven track record of delivering results.'
    },
    experience: [
      {
        id: 1,
        jobTitle: 'Senior Engineer',
        company: 'Tech Corp',
        location: 'NY',
        startDate: '2021-01',
        current: true,
        description: '• Led development team\n• Improved performance by 40%'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science',
        school: 'University',
        location: 'Boston',
        startDate: '2015-09',
        endDate: '2019-05'
      }
    ],
    skills: {
      technical: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      soft: ['Leadership', 'Communication']
    }
  };

  const templateColor = template.gradient?.includes('linear-gradient')
    ? '#667eea'
    : template.gradient || '#667eea';

  return (
    <div className="mini-template-wrapper">
      <div className="mini-resume-container" style={{ '--template-color': templateColor }}>
        {/* Resume Header */}
        <div className="mini-resume-header" style={{ background: template.gradient }}>
          <h1 className="mini-resume-name">{sampleData.personal.fullName}</h1>
          <div className="mini-resume-contact">
            <span>{sampleData.personal.email}</span>
            <span>•</span>
            <span>{sampleData.personal.phone}</span>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mini-resume-section">
          <h2 className="mini-section-title">Professional Summary</h2>
          <p className="mini-summary-text">{sampleData.personal.summary}</p>
        </div>

        {/* Experience */}
        <div className="mini-resume-section">
          <h2 className="mini-section-title">Work Experience</h2>
          {sampleData.experience.map(exp => (
            <div key={exp.id} className="mini-experience-item">
              <div className="mini-experience-header">
                <div>
                  <h3 className="mini-job-title">{exp.jobTitle}</h3>
                  <p className="mini-company-name">{exp.company}</p>
                </div>
                <div className="mini-date-range">2021 - Present</div>
              </div>
              <div className="mini-experience-description">
                {exp.description.split('\n').slice(0, 2).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mini-resume-section">
          <h2 className="mini-section-title">Education</h2>
          {sampleData.education.map(edu => (
            <div key={edu.id} className="mini-education-item">
              <h3 className="mini-degree-name">{edu.degree}</h3>
              <p className="mini-school-name">{edu.school}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mini-resume-section">
          <h2 className="mini-section-title">Skills</h2>
          <div className="mini-skills-container">
            <div className="mini-skill-tags">
              {sampleData.skills.technical.map((skill, i) => (
                <span key={i} className="mini-skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniTemplatePreview;
