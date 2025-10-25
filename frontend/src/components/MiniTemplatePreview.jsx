import React from 'react';
import './MiniTemplatePreview.css';

const MiniTemplatePreview = ({ template }) => {
  // Sample minimal data for mini preview
  const sampleData = {
    personal: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234-567-8900',
      summary: 'Experienced professional with expertise in modern technologies'
    },
    experience: {
      jobTitle: 'Senior Engineer',
      company: 'Tech Corp',
      period: '2021 - Present'
    },
    education: {
      degree: 'Bachelor of Science',
      school: 'University'
    },
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS']
  };

  const templateColor = template.gradient?.includes('linear-gradient')
    ? '#667eea'
    : template.gradient || '#667eea';

  const layoutType = template.layout?.type || 'single-column';
  const primaryColor = template.colors?.primary || '#3B82F6';
  const sidebarBg = template.colors?.sidebarBg || '#F3F4F6';

  // Render different layouts
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

  const renderSingleColumnLayout = () => (
    <>
      <div className="mini-resume-header" style={{ background: template.gradient }}>
        <h1 className="mini-resume-name">{sampleData.personal.fullName}</h1>
        <div className="mini-resume-contact">{sampleData.personal.email}</div>
      </div>
      <div className="mini-resume-section">
        <h2 className="mini-section-title" style={{ color: primaryColor }}>Summary</h2>
        <p className="mini-summary-text">{sampleData.personal.summary}</p>
      </div>
      <div className="mini-resume-section">
        <h2 className="mini-section-title" style={{ color: primaryColor }}>Experience</h2>
        <div className="mini-item">
          <h3 className="mini-job-title">{sampleData.experience.jobTitle}</h3>
          <p className="mini-company-name">{sampleData.experience.company}</p>
        </div>
      </div>
      <div className="mini-resume-section">
        <h2 className="mini-section-title" style={{ color: primaryColor }}>Education</h2>
        <div className="mini-item">
          <h3>{sampleData.education.degree}</h3>
        </div>
      </div>
    </>
  );

  const renderTwoColumnLayout = () => (
    <div className="mini-two-column-layout">
      <aside className="mini-sidebar" style={{ backgroundColor: sidebarBg, width: '35%' }}>
        <div className="mini-resume-header-compact" style={{ background: template.gradient, padding: '12px 8px' }}>
          <h1 className="mini-resume-name-small">{sampleData.personal.fullName}</h1>
        </div>
        <div className="mini-resume-section-small">
          <h2 className="mini-section-title-small" style={{ color: primaryColor }}>Skills</h2>
          <div className="mini-skill-list">
            {sampleData.skills.slice(0, 3).map((skill, i) => (
              <div key={i} className="mini-skill-item">
                <span>{skill}</span>
                <div className="mini-skill-bar" style={{ width: `${90 - i * 10}%`, backgroundColor: primaryColor }}></div>
              </div>
            ))}
          </div>
        </div>
      </aside>
      <main className="mini-main" style={{ width: '65%' }}>
        <div className="mini-resume-section-small">
          <h2 className="mini-section-title-small" style={{ color: primaryColor }}>Experience</h2>
          <div className="mini-item-small">
            <h3 className="mini-job-title-small">{sampleData.experience.jobTitle}</h3>
            <p className="mini-company-name-small">{sampleData.experience.company}</p>
          </div>
        </div>
        <div className="mini-resume-section-small">
          <h2 className="mini-section-title-small" style={{ color: primaryColor }}>Education</h2>
          <div className="mini-item-small">
            <h3 className="mini-degree-small">{sampleData.education.degree}</h3>
          </div>
        </div>
      </main>
    </div>
  );

  const renderTwoColumnEqualLayout = () => (
    <div className="mini-two-column-equal">
      <div className="mini-column" style={{ width: '48%' }}>
        <div className="mini-resume-header-compact" style={{ background: template.gradient, padding: '12px 8px' }}>
          <h1 className="mini-resume-name-small">{sampleData.personal.fullName}</h1>
        </div>
        <div className="mini-resume-section-small">
          <h2 className="mini-section-title-small" style={{ color: primaryColor }}>Skills</h2>
          <div className="mini-skill-tags-compact">
            {sampleData.skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="mini-skill-tag-compact" style={{ borderColor: primaryColor, color: primaryColor }}>{skill}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mini-column" style={{ width: '48%' }}>
        <div className="mini-resume-section-small" style={{ marginTop: '8px' }}>
          <h2 className="mini-section-title-small" style={{ color: primaryColor }}>Experience</h2>
          <div className="mini-item-small">
            <h3 className="mini-job-title-small">{sampleData.experience.jobTitle}</h3>
            <p className="mini-company-name-small">{sampleData.experience.company}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInfographicLayout = () => (
    <>
      <div className="mini-resume-header-modern" style={{ background: template.gradient, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 8px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
        <h1 className="mini-resume-name" style={{ fontSize: '11px' }}>{sampleData.personal.fullName}</h1>
      </div>
      <div className="mini-infographic-grid">
        <div className="mini-info-card" style={{ backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '6px' }}>
          <h2 className="mini-section-title-small" style={{ color: primaryColor, fontSize: '9px' }}>💼 Experience</h2>
          <h3 className="mini-job-title-small">{sampleData.experience.jobTitle}</h3>
        </div>
        <div className="mini-info-card" style={{ backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '6px' }}>
          <h2 className="mini-section-title-small" style={{ color: primaryColor, fontSize: '9px' }}>🎓 Education</h2>
          <h3 className="mini-degree-small">{sampleData.education.degree}</h3>
        </div>
      </div>
    </>
  );

  const renderTimelineLayout = () => (
    <>
      <div className="mini-resume-header" style={{ background: template.gradient }}>
        <h1 className="mini-resume-name">{sampleData.personal.fullName}</h1>
      </div>
      <div className="mini-timeline-container">
        <div className="mini-timeline-item" style={{ borderLeftColor: primaryColor }}>
          <div className="mini-timeline-dot" style={{ backgroundColor: primaryColor }}></div>
          <h3 className="mini-job-title">{sampleData.experience.jobTitle}</h3>
          <p className="mini-company-name">{sampleData.experience.company}</p>
          <span className="mini-period">{sampleData.experience.period}</span>
        </div>
        <div className="mini-timeline-item" style={{ borderLeftColor: primaryColor }}>
          <div className="mini-timeline-dot" style={{ backgroundColor: primaryColor }}></div>
          <h3>{sampleData.education.degree}</h3>
          <p className="mini-company-name">{sampleData.education.school}</p>
        </div>
      </div>
    </>
  );

  const renderModernBlocksLayout = () => (
    <>
      <div className="mini-resume-header-modern" style={{ background: template.gradient }}>
        <h1 className="mini-resume-name">{sampleData.personal.fullName}</h1>
      </div>
      <div className="mini-blocks-container">
        <div className="mini-block" style={{ borderLeftColor: primaryColor }}>
          <h2 className="mini-section-title" style={{ color: primaryColor }}>Experience</h2>
          <h3 className="mini-job-title">{sampleData.experience.jobTitle}</h3>
          <p className="mini-company-name">{sampleData.experience.company}</p>
        </div>
        <div className="mini-block" style={{ borderLeftColor: primaryColor }}>
          <h2 className="mini-section-title" style={{ color: primaryColor }}>Education</h2>
          <h3>{sampleData.education.degree}</h3>
        </div>
        <div className="mini-block" style={{ borderLeftColor: primaryColor }}>
          <h2 className="mini-section-title" style={{ color: primaryColor }}>Skills</h2>
          <div className="mini-skill-tags-compact">
            {sampleData.skills.slice(0, 4).map((skill, i) => (
              <span key={i} className="mini-skill-tag-compact">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderGridLayout = () => (
    <>
      <div className="mini-resume-header" style={{ background: template.gradient }}>
        <h1 className="mini-resume-name">{sampleData.personal.fullName}</h1>
      </div>
      <div className="mini-grid-container">
        <div className="mini-grid-item">
          <h2 className="mini-section-title-small" style={{ color: primaryColor }}>Experience</h2>
          <h3 className="mini-job-title-small">{sampleData.experience.jobTitle}</h3>
        </div>
        <div className="mini-grid-item">
          <h2 className="mini-section-title-small" style={{ color: primaryColor }}>Education</h2>
          <h3 className="mini-degree-small">{sampleData.education.degree}</h3>
        </div>
        <div className="mini-grid-item">
          <h2 className="mini-section-title-small" style={{ color: primaryColor }}>Skills</h2>
          <p className="mini-skill-list-compact">{sampleData.skills.slice(0, 3).join(', ')}</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="mini-template-wrapper">
      <div 
        className={`mini-resume-container layout-${layoutType}`}
        style={{ '--template-color': templateColor }}
      >
        {renderLayout()}
      </div>
    </div>
  );
};

export default MiniTemplatePreview;
