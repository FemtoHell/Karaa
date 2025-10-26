import React, { forwardRef } from 'react';
import './ResumePreview.css';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Draggable Section Component
const DraggableSection = ({ id, children, editable, sectionTitle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!editable) {
    return children;
  }

  return (
    <div ref={setNodeRef} style={style} className="draggable-section-wrapper">
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className={`section-drag-handle ${isDragging ? 'dragging' : ''}`}
        title={`Kéo để sắp xếp ${sectionTitle}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="5" cy="4" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="4" r="1.5" fill="currentColor"/>
          <circle cx="5" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="11" cy="12" r="1.5" fill="currentColor"/>
        </svg>
      </div>
      <div className={`section-content ${isDragging ? 'dragging' : ''}`}>
        {children}
      </div>
    </div>
  );
};

// Draggable Item Component (for items within sections like experience, education, etc.)
const DraggableItem = ({ id, children, editable }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!editable) {
    return children;
  }

  return (
    <div ref={setNodeRef} style={style} className="draggable-item-wrapper">
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className={`item-drag-handle ${isDragging ? 'dragging' : ''}`}
        title="Kéo để sắp xếp"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="4" cy="4" r="1.2" fill="currentColor"/>
          <circle cx="10" cy="4" r="1.2" fill="currentColor"/>
          <circle cx="4" cy="7" r="1.2" fill="currentColor"/>
          <circle cx="10" cy="7" r="1.2" fill="currentColor"/>
          <circle cx="4" cy="10" r="1.2" fill="currentColor"/>
          <circle cx="10" cy="10" r="1.2" fill="currentColor"/>
        </svg>
      </div>
      {children}
    </div>
  );
};

const ResumePreview = forwardRef(({
  cvData,
  customization,
  template,
  editable = false,
  onReorderSections,
  onReorderExperience,
  onReorderEducation,
  onReorderProjects,
  onReorderCertificates,
  onReorderActivities
}, ref) => {
  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before activating drag
      },
    })
  );

  // Handle section reordering
  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id && onReorderSections) {
      onReorderSections(active.id, over.id);
    }
  };

  // Handle item reordering within sections
  const handleItemDragEnd = (sectionType) => (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const activeIndex = parseInt(active.id.split('-')[1]);
      const overIndex = parseInt(over.id.split('-')[1]);

      switch (sectionType) {
        case 'experience':
          onReorderExperience?.(activeIndex, overIndex);
          break;
        case 'education':
          onReorderEducation?.(activeIndex, overIndex);
          break;
        case 'projects':
          onReorderProjects?.(activeIndex, overIndex);
          break;
        case 'certificates':
          onReorderCertificates?.(activeIndex, overIndex);
          break;
        case 'activities':
          onReorderActivities?.(activeIndex, overIndex);
          break;
        default:
          break;
      }
    }
  };

  // Use template configuration or fallback to defaults
  const currentTemplate = template || {
    name: 'Classic',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    layout: { type: 'single-column', columns: { count: 1, widths: ['100%'], gap: '0px' } },
    sections: {
      order: ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certificates', 'activities'],
      visible: { personal: true, summary: true, experience: true, education: true, skills: true, projects: true, certificates: true, activities: true }
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      sizes: { name: '36px', heading: '20px', subheading: '17px', body: '14px' }
    },
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      text: '#111827',
      textLight: '#6B7280',
      background: '#FFFFFF'
    },
    features: { hasPhoto: false, hasIcons: false, hasCharts: false, atsFriendly: true, multiPage: false }
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

  // Get template colors (prioritize template.colors over customization.colorScheme)
  const templateColors = currentTemplate.colors || {
    primary: getColorValue(customization?.colorScheme),
    secondary: getSecondaryColor(customization?.colorScheme),
    text: '#111827',
    textLight: '#6B7280',
    background: '#FFFFFF'
  };

  // Get template typography
  const templateTypography = currentTemplate.typography || {
    headingFont: customization?.font || 'Inter',
    bodyFont: customization?.font || 'Inter',
    sizes: {
      name: '36px',
      heading: '20px',
      subheading: '17px',
      body: `${14 * (customization?.fontSize === 'small' ? 0.9 : customization?.fontSize === 'large' ? 1.1 : 1.0)}px`
    }
  };

  // Get section order and visibility
  const sectionOrder = currentTemplate.sections?.order || ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certificates', 'activities'];
  const sectionVisibility = currentTemplate.sections?.visible || {
    personal: true, summary: true, experience: true, education: true,
    skills: true, projects: true, certificates: true, activities: true
  };

  // Get layout configuration
  const layoutType = currentTemplate.layout?.type || customization?.layout || 'single-column';
  const layoutColumns = currentTemplate.layout?.columns || { count: 1, widths: ['100%'], gap: '0px' };

  // Render section components
  const renderSection = (sectionName) => {
    if (!sectionVisibility[sectionName]) return null;

    switch (sectionName) {
      case 'personal':
        return renderPersonalSection();
      case 'summary':
        return renderSummarySection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      case 'languages':
        return renderLanguagesSection();
      case 'projects':
        return renderProjectsSection();
      case 'certificates':
        return renderCertificatesSection();
      case 'activities':
        return renderActivitiesSection();
      default:
        return null;
    }
  };

  // Personal/Header Section
  const renderPersonalSection = () => {
    const hasPhoto = cvData?.personal?.photo && currentTemplate.features?.hasPhoto;
    const photoStyle = customization?.photoStyle || currentTemplate.photoConfig?.style || 'circle';
    const photoPosition = customization?.photoPosition || currentTemplate.photoConfig?.position || 'header';
    
    return (
      <div className="resume-header-styled" style={{
        background: currentTemplate.gradient,
        fontFamily: templateTypography.headingFont,
        position: 'relative'
      }}>
        {/* Photo rendering based on position */}
        {hasPhoto && photoPosition === 'top-left' && (
          <div className={`resume-photo resume-photo-${photoStyle}`} style={{
            width: '100px',
            height: '100px',
            position: 'absolute',
            top: '20px',
            left: '20px',
            overflow: 'hidden',
            borderRadius: photoStyle === 'circle' ? '50%' : photoStyle === 'rounded' ? '12px' : '0',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            zIndex: 10
          }}>
            <img
              src={cvData.personal.photo}
              alt={cvData.personal.fullName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
        
        {hasPhoto && photoPosition === 'top-right' && (
          <div className={`resume-photo resume-photo-${photoStyle}`} style={{
            width: '100px',
            height: '100px',
            position: 'absolute',
            top: '20px',
            right: '20px',
            overflow: 'hidden',
            borderRadius: photoStyle === 'circle' ? '50%' : photoStyle === 'rounded' ? '12px' : '0',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            zIndex: 10
          }}>
            <img
              src={cvData.personal.photo}
              alt={cvData.personal.fullName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
        
        {hasPhoto && photoPosition === 'header' && (
          <div className={`resume-photo resume-photo-${photoStyle}`} style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 16px',
            overflow: 'hidden',
            borderRadius: photoStyle === 'circle' ? '50%' : photoStyle === 'rounded' ? '12px' : '0',
            border: '4px solid rgba(255, 255, 255, 0.3)'
          }}>
            <img
              src={cvData.personal.photo}
              alt={cvData.personal.fullName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
        
        <h1 className="resume-name-styled" style={{ fontSize: templateTypography.sizes.name }}>
          {cvData?.personal?.fullName || 'Your Name'}
        </h1>
        <div className="resume-contact-styled" style={{ fontSize: templateTypography.sizes.body }}>
          {cvData?.personal?.email && <span>{cvData.personal.email}</span>}
          {cvData?.personal?.email && cvData?.personal?.phone && <span>•</span>}
          {cvData?.personal?.phone && <span>{cvData.personal.phone}</span>}
          {(cvData?.personal?.email || cvData?.personal?.phone) && cvData?.personal?.location && <span>•</span>}
          {cvData?.personal?.location && <span>{cvData.personal.location}</span>}
        </div>
        <div className="resume-links-styled" style={{ fontSize: templateTypography.sizes.body }}>
          {cvData?.personal?.linkedin && <span>{cvData.personal.linkedin}</span>}
          {cvData?.personal?.linkedin && cvData?.personal?.website && <span>•</span>}
          {cvData?.personal?.website && <span>{cvData.personal.website}</span>}
        </div>
      </div>
    );
  };

  // Summary Section
  const renderSummarySection = () => {
    if (!cvData?.personal?.summary) return null;
    return (
      <div key="summary" className="resume-section-styled">
        <h2 className="section-title-styled" style={{
          color: templateColors.primary,
          fontSize: templateTypography.sizes.heading,
          fontFamily: templateTypography.headingFont
        }}>
          Professional Summary
        </h2>
        <p className="summary-text" style={{
          fontFamily: templateTypography.bodyFont,
          fontSize: templateTypography.sizes.body,
          color: templateColors.text
        }}>
          {cvData.personal.summary}
        </p>
      </div>
    );
  };

  // Experience Section
  const renderExperienceSection = () => {
    if (!cvData?.experience || cvData.experience.length === 0) return null;

    const experienceIds = cvData.experience.map((_, idx) => `experience-${idx}`);

    return (
      <div key="experience" className="resume-section-styled">
        <h2 className="section-title-styled" style={{
          color: templateColors.primary,
          fontSize: templateTypography.sizes.heading,
          fontFamily: templateTypography.headingFont
        }}>
          Experience
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleItemDragEnd('experience')}
        >
          <SortableContext items={experienceIds} strategy={verticalListSortingStrategy}>
            {cvData.experience.map((exp, idx) => (
              <DraggableItem key={`experience-${idx}`} id={`experience-${idx}`} editable={editable}>
                <div className="resume-item">
                  <div className="item-header">
                    <div className="item-title-group">
                      <h3 className="item-title" style={{
                        fontSize: templateTypography.sizes.subheading,
                        color: templateColors.text
                      }}>{exp.jobTitle}</h3>
                      <div className="item-subtitle" style={{
                        fontSize: templateTypography.sizes.body,
                        color: templateColors.textLight
                      }}>{exp.company}{exp.location ? ` • ${exp.location}` : ''}</div>
                    </div>
                    <div className="item-date" style={{
                      fontSize: templateTypography.sizes.body,
                      color: templateColors.textLight
                    }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  
                  {/* Render Achievements if available */}
                  {exp.achievements && exp.achievements.length > 0 ? (
                    <ul style={{
                      margin: '8px 0 0 0',
                      padding: '0 0 0 20px',
                      fontSize: templateTypography.sizes.body,
                      color: templateColors.text,
                      lineHeight: '1.6'
                    }}>
                      {exp.achievements.map((achievement, achIdx) => (
                        <li key={achIdx} style={{ marginBottom: '4px' }}>
                          {achievement.replace(/^[•\-\*]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    /* Legacy Description */
                    exp.description && (
                      <p className="item-description" style={{
                        fontSize: templateTypography.sizes.body,
                        color: templateColors.text,
                        marginTop: '8px',
                        lineHeight: '1.6'
                      }}>
                        {exp.description}
                      </p>
                    )
                  )}
                </div>
              </DraggableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    );
  };

  // Education Section
  const renderEducationSection = () => {
    if (!cvData?.education || cvData.education.length === 0) return null;

    const educationIds = cvData.education.map((_, idx) => `education-${idx}`);

    return (
      <div key="education" className="resume-section-styled">
        <h2 className="section-title-styled" style={{
          color: templateColors.primary,
          fontSize: templateTypography.sizes.heading,
          fontFamily: templateTypography.headingFont
        }}>
          Education
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleItemDragEnd('education')}
        >
          <SortableContext items={educationIds} strategy={verticalListSortingStrategy}>
            {cvData.education.map((edu, idx) => (
              <DraggableItem key={`education-${idx}`} id={`education-${idx}`} editable={editable}>
                <div className="resume-item">
                  <div className="item-header">
                    <div className="item-title-group">
                      <h3 className="item-title" style={{
                        fontSize: templateTypography.sizes.subheading,
                        color: templateColors.text
                      }}>{edu.degree}</h3>
                      <div className="item-subtitle" style={{
                        fontSize: templateTypography.sizes.body,
                        color: templateColors.textLight
                      }}>{edu.school}</div>
                    </div>
                    <div className="item-date" style={{
                      fontSize: templateTypography.sizes.body,
                      color: templateColors.textLight
                    }}>
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                  {edu.location && <div className="item-location" style={{
                    fontSize: templateTypography.sizes.body,
                    color: templateColors.textLight
                  }}>{edu.location}</div>}
                  {edu.gpa && <div className="item-gpa" style={{
                    fontSize: templateTypography.sizes.body,
                    color: templateColors.text
                  }}>GPA: {edu.gpa}</div>}
                  {edu.description && <p className="item-description" style={{
                    fontSize: templateTypography.sizes.body,
                    color: templateColors.text
                  }}>{edu.description}</p>}
                </div>
              </DraggableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    );
  };

  // Skills Section
  const renderSkillsSection = () => {
    const hasLegacySkills = cvData?.skills && (
      (cvData.skills.technical && cvData.skills.technical.length > 0) ||
      (cvData.skills.soft && cvData.skills.soft.length > 0) ||
      (cvData.skills.languages && cvData.skills.languages.length > 0)
    );
    
    const hasNewSkills = cvData?.skillsWithProficiency && cvData.skillsWithProficiency.length > 0;
    
    if (!hasLegacySkills && !hasNewSkills) return null;

    return (
      <div key="skills" className="resume-section-styled">
        <h2 className="section-title-styled" style={{
          color: templateColors.primary,
          fontSize: templateTypography.sizes.heading,
          fontFamily: templateTypography.headingFont
        }}>
          Skills & Expertise
        </h2>
        
        {/* New Skills with Proficiency */}
        {hasNewSkills && (
          <div className="skills-with-proficiency" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cvData.skillsWithProficiency.map((skill, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: templateTypography.sizes.body,
                    fontWeight: '600',
                    color: templateColors.text
                  }}>
                    {skill.name}
                  </span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(level => (
                      <span
                        key={level}
                        style={{
                          fontSize: '14px',
                          color: level <= skill.proficiency ? '#FBBF24' : '#E5E7EB'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{
                  height: '6px',
                  background: '#E5E7EB',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(skill.proficiency / 5) * 100}%`,
                    height: '100%',
                    background: templateColors.primary,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Legacy Skills */}
        {hasLegacySkills && (
          <div style={{ marginTop: hasNewSkills ? '16px' : '0' }}>
            {cvData.skills.technical?.length > 0 && (
              <div className="skills-group" style={{
                fontSize: templateTypography.sizes.body,
                color: templateColors.text,
                marginBottom: '8px'
              }}>
                <strong>Technical:</strong> {cvData.skills.technical.join(', ')}
              </div>
            )}
            {cvData.skills.soft?.length > 0 && (
              <div className="skills-group" style={{
                fontSize: templateTypography.sizes.body,
                color: templateColors.text,
                marginBottom: '8px'
              }}>
                <strong>Soft Skills:</strong> {cvData.skills.soft.join(', ')}
              </div>
            )}
            {cvData.skills.languages?.length > 0 && (
              <div className="skills-group" style={{
                fontSize: templateTypography.sizes.body,
                color: templateColors.text
              }}>
                <strong>Languages:</strong> {cvData.skills.languages.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Languages Section
  const renderLanguagesSection = () => {
    const languages = cvData?.skills?.languages || [];
    if (languages.length === 0) return null;

    const sectionConfig = currentTemplate.sections?.config?.languages || {};
    const displayType = sectionConfig.displayType || 'list';
    const position = sectionConfig.position || 'main';

    return (
      <div key="languages" className="resume-section-styled">
        <h2 className={position === 'sidebar' ? 'sidebar-title' : 'section-title-styled'} style={{
          color: templateColors.primary,
          fontSize: position === 'sidebar' ? '16px' : templateTypography.sizes.heading,
          fontFamily: templateTypography.headingFont
        }}>
          Languages
        </h2>

        {displayType === 'bars' && (
          <div className={position === 'sidebar' ? 'sidebar-skills' : 'skills-grid'}>
            {languages.map((language, i) => (
              <div key={i} className="skill-item">
                <span className="skill-name" style={{
                  fontSize: templateTypography.sizes.body,
                  color: position === 'sidebar' ? templateColors.text : templateColors.text
                }}>{language}</span>
                {position === 'sidebar' && (
                  <div className="skill-bar-container">
                    <div className="skill-bar" style={{
                      width: `${Math.max(70, 95 - i * 10)}%`,
                      backgroundColor: templateColors.primary
                    }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {displayType === 'list' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {languages.map((language, i) => (
              <span key={i} style={{
                padding: '6px 14px',
                background: position === 'sidebar' ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
                color: position === 'sidebar' ? templateColors.text : templateColors.text,
                borderRadius: '6px',
                fontSize: templateTypography.sizes.body,
                fontWeight: '500'
              }}>
                {language}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // SIDEBAR COMPACT HELPERS (for Two-Column Layout)
  // ============================================================================

  const renderSidebarPersonal = () => {
    return (
      <div className="sidebar-section">
        <h1 className="sidebar-name" style={{ color: currentTemplate.colors?.primary }}>
          {cvData.personal.fullName || 'Your Name'}
        </h1>
        {cvData.personal.email && <p className="sidebar-contact">{cvData.personal.email}</p>}
        {cvData.personal.phone && <p className="sidebar-contact">{cvData.personal.phone}</p>}
        {cvData.personal.location && <p className="sidebar-contact">{cvData.personal.location}</p>}
      </div>
    );
  };

  const renderSidebarSkills = () => {
    // Check new skills format first
    const hasNewSkills = cvData?.skillsWithProficiency && cvData.skillsWithProficiency.length > 0;
    const hasLegacySkills = cvData?.skills && (
      (cvData.skills.technical && cvData.skills.technical.length > 0) ||
      (cvData.skills.soft && cvData.skills.soft.length > 0)
    );

    if (!hasNewSkills && !hasLegacySkills) return null;

    // Use new skills if available, otherwise fallback to legacy
    const skillsToDisplay = hasNewSkills
      ? cvData.skillsWithProficiency.slice(0, 6)
      : [...(cvData.skills?.technical || []), ...(cvData.skills?.soft || [])].slice(0, 6);

    return (
      <div className="sidebar-section">
        <h2 className="sidebar-title" style={{ color: currentTemplate.colors?.primary }}>
          Skills
        </h2>
        <div className="sidebar-skills">
          {skillsToDisplay.map((skill, i) => {
            const skillName = typeof skill === 'string' ? skill : skill.name;
            const proficiency = typeof skill === 'string' ? null : skill.proficiency;
            const barWidth = proficiency ? `${(proficiency / 5) * 100}%` : `${85 - i * 5}%`;

            return (
              <div key={i} className="skill-item">
                <span className="skill-name">{skillName}</span>
                <div className="skill-bar-container">
                  <div className="skill-bar" style={{
                    width: barWidth,
                    backgroundColor: currentTemplate.colors?.primary
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSidebarLanguages = () => {
    const languages = cvData?.skills?.languages || [];
    if (languages.length === 0) return null;

    return (
      <div className="sidebar-section">
        <h2 className="sidebar-title" style={{ color: currentTemplate.colors?.primary }}>
          Languages
        </h2>
        <div className="sidebar-skills">
          {languages.slice(0, 4).map((language, i) => (
            <div key={i} className="skill-item">
              <span className="skill-name">{language}</span>
              <div className="skill-bar-container">
                <div className="skill-bar" style={{
                  width: `${Math.max(70, 95 - i * 10)}%`,
                  backgroundColor: currentTemplate.colors?.primary
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN SECTION RENDERERS
  // ============================================================================

  // Projects Section
  const renderProjectsSection = () => {
    if (!cvData?.projects || cvData.projects.length === 0) return null;

    const projectIds = cvData.projects.map((_, idx) => `project-${idx}`);

    return (
      <div key="projects" className="resume-section-styled">
        <h2 className="section-title-styled" style={{
          color: templateColors.primary,
          fontSize: templateTypography.sizes.heading,
          fontFamily: templateTypography.headingFont
        }}>
          Projects
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleItemDragEnd('projects')}
        >
          <SortableContext items={projectIds} strategy={verticalListSortingStrategy}>
            {cvData.projects.map((proj, idx) => (
              <DraggableItem key={`project-${idx}`} id={`project-${idx}`} editable={editable}>
                <div className="resume-item">
                  <div className="item-header">
                    <div className="item-title-group">
                      <h3 className="item-title" style={{
                        fontSize: templateTypography.sizes.subheading,
                        color: templateColors.text
                      }}>{proj.name}</h3>
                      {proj.technologies && <div className="item-subtitle" style={{
                        fontSize: templateTypography.sizes.body,
                        color: templateColors.textLight
                      }}>{proj.technologies}</div>}
                    </div>
                    {proj.startDate && (
                      <div className="item-date" style={{
                        fontSize: templateTypography.sizes.body,
                        color: templateColors.textLight
                      }}>
                        {proj.startDate} - {proj.endDate || 'Present'}
                      </div>
                    )}
                  </div>
                  {proj.description && <p className="item-description" style={{
                    fontSize: templateTypography.sizes.body,
                    color: templateColors.text
                  }}>{proj.description}</p>}
                  {proj.link && <a href={proj.link} className="item-link" style={{
                    fontSize: templateTypography.sizes.body,
                    color: templateColors.primary
                  }}>{proj.link}</a>}
                </div>
              </DraggableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    );
  };

  // Certificates Section
  const renderCertificatesSection = () => {
    if (!cvData?.certificates || cvData.certificates.length === 0) return null;

    const certificateIds = cvData.certificates.map((_, idx) => `certificate-${idx}`);

    return (
      <div key="certificates" className="resume-section-styled">
        <h2 className="section-title-styled" style={{
          color: templateColors.primary,
          fontSize: templateTypography.sizes.heading,
          fontFamily: templateTypography.headingFont
        }}>
          Certificates
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleItemDragEnd('certificates')}
        >
          <SortableContext items={certificateIds} strategy={verticalListSortingStrategy}>
            {cvData.certificates.map((cert, idx) => (
              <DraggableItem key={`certificate-${idx}`} id={`certificate-${idx}`} editable={editable}>
                <div className="resume-item">
                  <div className="item-header">
                    <div className="item-title-group">
                      <h3 className="item-title" style={{
                        fontSize: templateTypography.sizes.subheading,
                        color: templateColors.text
                      }}>{cert.name}</h3>
                      {cert.issuer && <div className="item-subtitle" style={{
                        fontSize: templateTypography.sizes.body,
                        color: templateColors.textLight
                      }}>{cert.issuer}</div>}
                    </div>
                    {cert.date && <div className="item-date" style={{
                      fontSize: templateTypography.sizes.body,
                      color: templateColors.textLight
                    }}>{cert.date}</div>}
                  </div>
                  {cert.description && <p className="item-description" style={{
                    fontSize: templateTypography.sizes.body,
                    color: templateColors.text
                  }}>{cert.description}</p>}
                </div>
              </DraggableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    );
  };

  // Activities Section
  const renderActivitiesSection = () => {
    if (!cvData?.activities || cvData.activities.length === 0) return null;

    const activityIds = cvData.activities.map((_, idx) => `activity-${idx}`);

    return (
      <div key="activities" className="resume-section-styled">
        <h2 className="section-title-styled" style={{
          color: templateColors.primary,
          fontSize: templateTypography.sizes.heading,
          fontFamily: templateTypography.headingFont
        }}>
          Activities & Volunteering
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleItemDragEnd('activities')}
        >
          <SortableContext items={activityIds} strategy={verticalListSortingStrategy}>
            {cvData.activities.map((activity, idx) => (
              <DraggableItem key={`activity-${idx}`} id={`activity-${idx}`} editable={editable}>
                <div className="resume-item">
                  <div className="item-header">
                    <div className="item-title-group">
                      <h3 className="item-title" style={{
                        fontSize: templateTypography.sizes.subheading,
                        color: templateColors.text
                      }}>{activity.title}</h3>
                      {activity.organization && <div className="item-subtitle" style={{
                        fontSize: templateTypography.sizes.body,
                        color: templateColors.textLight
                      }}>{activity.organization}</div>}
                    </div>
                    {activity.startDate && (
                      <div className="item-date" style={{
                        fontSize: templateTypography.sizes.body,
                        color: templateColors.textLight
                      }}>
                        {activity.startDate} - {activity.current ? 'Present' : activity.endDate}
                      </div>
                    )}
                  </div>
                  {activity.description && <p className="item-description" style={{
                    fontSize: templateTypography.sizes.body,
                    color: templateColors.text
                  }}>{activity.description}</p>}
                </div>
              </DraggableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    );
  };

  // Render layout based on template type
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

  // Single Column Layout (Traditional)
  const renderSingleColumnLayout = () => {
    const sectionTitles = {
      personal: 'Header',
      summary: 'Summary',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      certificates: 'Certificates',
      activities: 'Activities'
    };

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
      >
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          {sectionOrder.map((sectionName) => (
            <DraggableSection
              key={sectionName}
              id={sectionName}
              editable={editable}
              sectionTitle={sectionTitles[sectionName]}
            >
              {renderSection(sectionName)}
            </DraggableSection>
          ))}
        </SortableContext>
      </DndContext>
    );
  };

  // Two Column Layout (Sidebar + Main) - Restored Original Essence
  const renderTwoColumnLayout = () => {
    const hasPhoto = cvData?.personal?.photo && currentTemplate.features?.hasPhoto;
    const photoStyle = customization?.photoStyle || currentTemplate.photoConfig?.style || 'circle';

    // Get section configuration from template
    const sectionConfig = currentTemplate.sections?.config || {};

    // Split sections into sidebar and main based on position config
    const sidebarSections = [];
    const mainSections = [];

    sectionOrder.forEach(sectionName => {
      if (!sectionVisibility[sectionName]) return;

      const position = sectionConfig[sectionName]?.position || 'main';
      if (position === 'sidebar') {
        sidebarSections.push(sectionName);
      } else {
        mainSections.push(sectionName);
      }
    });

    // Helper to render sidebar sections with compact style
    const renderSidebarSection = (sectionName) => {
      switch (sectionName) {
        case 'personal':
          return renderSidebarPersonal();
        case 'skills':
          return renderSidebarSkills();
        case 'languages':
          return renderSidebarLanguages();
        default:
          // For other sections, render in sidebar with compact wrapper
          return (
            <div key={sectionName} className="sidebar-section">
              {renderSection(sectionName)}
            </div>
          );
      }
    };

    return (
      <div className="resume-two-column">
        <aside className="resume-sidebar" style={{
          backgroundColor: currentTemplate.colors?.sidebarBg || '#F3F4F6',
          width: currentTemplate.layout?.columns?.widths[0] || '30%'
        }}>
          {/* Photo (if in sidebar) */}
          {hasPhoto && currentTemplate.photoConfig?.position === 'sidebar' && (
            <div className={`resume-photo resume-photo-${photoStyle}`} style={{ marginBottom: '20px' }}>
              <img src={cvData.personal.photo} alt={cvData.personal.fullName} />
            </div>
          )}

          {/* Render sidebar sections with compact helpers */}
          {sidebarSections.map(sectionName => (
            <React.Fragment key={sectionName}>
              {renderSidebarSection(sectionName)}
            </React.Fragment>
          ))}
        </aside>

        <main className="resume-main" style={{ width: currentTemplate.layout?.columns?.widths[1] || '70%' }}>
          {/* Render main sections with full detail */}
          {mainSections.map(sectionName => (
            <div key={sectionName} className="resume-section">
              {renderSection(sectionName)}
            </div>
          ))}
        </main>
      </div>
    );
  };

  // Two Column Equal Layout (50/50)
  const renderTwoColumnEqualLayout = () => {
    const midPoint = Math.ceil(sectionOrder.length / 2);
    const leftSections = sectionOrder.slice(0, midPoint);
    const rightSections = sectionOrder.slice(midPoint);
    
    return (
      <div className="resume-two-column-equal-container">
        <div className="resume-column-left">
          {leftSections.map((sectionName) => renderSection(sectionName))}
        </div>
        <div className="resume-column-right">
          {rightSections.map((sectionName) => renderSection(sectionName))}
        </div>
      </div>
    );
  };

  // Timeline Layout - MATCH TemplatePreview EXACTLY
  const renderTimelineLayout = () => {
    const hasPhoto = cvData?.personal?.photo && currentTemplate.features?.hasPhoto;
    const photoStyle = customization?.photoStyle || currentTemplate.photoConfig?.style || 'circle';
    
    return (
      <>
        <div className="resume-header" style={{ background: currentTemplate.gradient }}>
          {hasPhoto && (
            <div className={`resume-photo resume-photo-${photoStyle}`}>
              <img src={cvData.personal.photo} alt={cvData.personal.fullName} />
            </div>
          )}
          <h1 className="resume-name">{cvData.personal.fullName || 'Your Name'}</h1>
          <p className="resume-contact" style={{ color: '#FFFFFF', opacity: 0.95 }}>
            {cvData.personal.email} • {cvData.personal.phone}
          </p>
        </div>

        <div className="resume-section">
          <h2 className="section-title" style={{ color: currentTemplate.colors?.primary }}>Professional Summary</h2>
          <p className="summary-text">{cvData.personal?.summary}</p>
        </div>

        <div className="resume-section">
          <h2 className="section-title" style={{ color: currentTemplate.colors?.primary }}>Career Timeline</h2>
          <div className="timeline-container">
            {cvData.experience?.map((exp, index) => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-marker" style={{ backgroundColor: currentTemplate.colors?.primary }}>
                  <div className="timeline-dot"></div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-date" style={{ color: currentTemplate.colors?.primary }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                  <h3 className="timeline-title">{exp.jobTitle}</h3>
                  <p className="timeline-company">{exp.company} • {exp.location}</p>
                  <p className="timeline-description">{exp.description}</p>
                </div>
              </div>
            ))}
            {cvData.education?.map((edu, index) => (
              <div key={edu.id} className="timeline-item">
                <div className="timeline-marker" style={{ backgroundColor: currentTemplate.colors?.secondary }}>
                  <div className="timeline-dot"></div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-date" style={{ color: currentTemplate.colors?.secondary }}>
                    {edu.startDate} - {edu.endDate}
                  </div>
                  <h3 className="timeline-title">{edu.degree}</h3>
                  <p className="timeline-company">{edu.school}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="resume-section">
          <h2 className="section-title" style={{ color: currentTemplate.colors?.primary }}>Skills</h2>
          <div className="skill-tags">
            {[...(cvData.skills?.technical || []), ...(cvData.skills?.soft || [])].map((skill, i) => (
              <span key={i} className="skill-tag" style={{ 
                borderColor: currentTemplate.colors?.primary,
                color: currentTemplate.colors?.primary 
              }}>{skill}</span>
            ))}
          </div>
        </div>
      </>
    );
  };

  // Modern Blocks Layout - Match TemplatePreview structure
  const renderModernBlocksLayout = () => (
    <>
      {renderSection('personal')}
      
      <div className="blocks-container">
        {/* Summary Block */}
        {cvData?.personal?.summary && (
          <div className="block-card" style={{ borderLeftColor: templateColors.primary }}>
            <h2 className="section-title-styled" style={{ color: templateColors.primary, marginTop: 0 }}>
              Professional Summary
            </h2>
            <p className="summary-text">{cvData.personal.summary}</p>
          </div>
        )}

        {/* Experience Block */}
        {cvData?.experience && cvData.experience.length > 0 && (
          <div className="block-card" style={{ borderLeftColor: templateColors.primary }}>
            <h2 className="section-title-styled" style={{ color: templateColors.primary, marginTop: 0 }}>
              Work Experience
            </h2>
            {cvData.experience.map((exp, idx) => (
              <div key={idx} className="resume-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <h3 className="item-title">{exp.jobTitle}</h3>
                    <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.6 }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="block-row">
          {/* Education Block */}
          {cvData?.education && cvData.education.length > 0 && (
            <div className="block-card" style={{ flex: 1, borderLeftColor: templateColors.secondary }}>
              <h2 className="section-title-styled" style={{ color: templateColors.primary, marginTop: 0 }}>
                Education
              </h2>
              {cvData.education.map((edu, idx) => (
                <div key={idx} className="resume-item">
                  <h3 className="item-title">{edu.degree}</h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{edu.school}</p>
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Skills Block */}
          {cvData?.skills && (cvData.skills.technical?.length > 0 || cvData.skills.soft?.length > 0) && (
            <div className="block-card" style={{ flex: 1, borderLeftColor: templateColors.secondary }}>
              <h2 className="section-title-styled" style={{ color: templateColors.primary, marginTop: 0 }}>
                Skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[...(cvData.skills.technical || []), ...(cvData.skills.soft || [])].map((skill, i) => (
                  <span key={i} style={{
                    padding: '6px 14px',
                    background: '#FFFFFF',
                    border: `1.5px solid ${templateColors.primary}`,
                    color: templateColors.primary,
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Infographic Layout - MATCH TemplatePreview EXACTLY
  const renderInfographicLayout = () => {
    const hasPhoto = cvData?.personal?.photo && currentTemplate.features?.hasPhoto;
    const photoStyle = customization?.photoStyle || currentTemplate.photoConfig?.style || 'circle';
    
    return (
      <>
        <div className="infographic-header" style={{ 
          background: currentTemplate.gradient,
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
              <img src={cvData.personal.photo} alt={cvData.personal.fullName} />
            </div>
          )}
          <div>
            <h1 className="resume-name" style={{ color: '#FFFFFF', fontSize: '38px', marginBottom: '10px' }}>
              {cvData.personal.fullName || 'Your Name'}
            </h1>
            <p style={{ color: '#FFFFFF', opacity: 0.95, fontSize: '16px' }}>
              {cvData.personal.email} • {cvData.personal.phone}
            </p>
            <p style={{ color: '#FFFFFF', opacity: 0.95, fontSize: '14px', marginTop: '10px' }}>
              {cvData.personal.summary}
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
              <h2 className="section-title" style={{ color: currentTemplate.colors?.primary, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>💼</span> Experience
              </h2>
              {cvData.experience?.map(exp => (
                <div key={exp.id} style={{ marginBottom: '15px' }}>
                  <h3 className="job-title" style={{ fontSize: '16px', fontWeight: '600' }}>{exp.jobTitle}</h3>
                  <p className="company-name" style={{ color: currentTemplate.colors?.textLight }}>{exp.company}</p>
                </div>
              ))}
            </div>

            <div className="info-card" style={{ 
              backgroundColor: '#FFFFFF',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 className="section-title" style={{ color: currentTemplate.colors?.primary, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🎓</span> Education
              </h2>
              {cvData.education?.map(edu => (
                <div key={edu.id}>
                  <h3 className="degree-name" style={{ fontSize: '16px', fontWeight: '600' }}>{edu.degree}</h3>
                  <p className="school-name" style={{ color: currentTemplate.colors?.textLight }}>{edu.school}</p>
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
              <h2 className="section-title" style={{ color: currentTemplate.colors?.primary, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>⚡</span> Skills
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
                {[...(cvData.skills?.technical || []), ...(cvData.skills?.soft || [])].slice(0, 6).map((skill, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      margin: '0 auto 10px',
                      borderRadius: '50%',
                      border: `4px solid ${currentTemplate.colors?.primary}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: currentTemplate.colors?.primary
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
  };

  // Grid Layout
  const renderGridLayout = () => (
    <div className="resume-grid-container">
      {sectionOrder.map((sectionName) => (
        <div key={sectionName} className="grid-section">
          {renderSection(sectionName)}
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      className={`resume-preview-page layout-${layoutType}`}
      style={{
        '--template-color': currentTemplate.color,
        '--primary-color': templateColors.primary,
        '--secondary-color': templateColors.secondary,
        '--text-color': templateColors.text,
        '--text-light-color': templateColors.textLight,
        '--background-color': templateColors.background,
        '--sidebar-bg': templateColors.sidebarBg || '#F3F4F6',
        '--column-gap': layoutColumns.gap || '24px',
        fontFamily: templateTypography.bodyFont,
        fontSize: templateTypography.sizes.body,
        '--spacing-scale': customization?.spacing === 'compact' ? 0.8 : customization?.spacing === 'relaxed' ? 1.2 : 1.0,
        background: templateColors.background,
        color: templateColors.text
      }}
    >
      {renderLayout()}
    </div>
  );
});

export default ResumePreview;
