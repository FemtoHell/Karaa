import React, { useState, useEffect } from 'react';
import './Editor.css';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import EditableField from './components/EditableField';
import { API_ENDPOINTS, apiRequest } from './config/api';
import { useAuth } from './AuthContext';
import { resumeService } from './services/api.service';
import {
  saveGuestResume,
  getGuestResume,
  updateGuestResume,
  migrateGuestData,
  isGuestMode
} from './utils/guestSession';

const Editor = () => {
  const [searchParams] = useSearchParams();
  const { id: resumeId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const templateId = searchParams.get('template');
  const action = searchParams.get('action');

  const [currentResumeId, setCurrentResumeId] = useState(resumeId || null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'
  const [guestMode, setGuestMode] = useState(!isAuthenticated);

  const [activeTab, setActiveTab] = useState('personal');
  const [showCustomization, setShowCustomization] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [showPreview, setShowPreview] = useState(action === 'preview');
  const [customization, setCustomization] = useState({
    font: 'Inter',
    fontSize: 'medium',
    colorScheme: 'blue',
    spacing: 'normal',
    layout: 'single-column',
    templateId: templateId || null
  });

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

  const [sectionOrder, setSectionOrder] = useState([
    'personal', 'experience', 'education', 'skills', 'projects', 'certificates', 'activities'
  ]);

  const [sectionVisibility, setSectionVisibility] = useState({
    personal: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certificates: true,
    activities: true
  });
  const [cvData, setCvData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    experience: [
      {
        id: 1,
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ],
    education: [
      {
        id: 1,
        degree: '',
        school: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
      }
    ],
    skills: {
      technical: [],
      soft: [],
      languages: []
    },
    projects: [
      {
        id: 1,
        name: '',
        description: '',
        technologies: '',
        link: '',
        startDate: '',
        endDate: ''
      }
    ],
    certificates: [
      {
        id: 1,
        name: '',
        issuer: '',
        date: '',
        link: '',
        description: ''
      }
    ],
    activities: [
      {
        id: 1,
        title: '',
        organization: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]
  });

  // Create resume when using template
  useEffect(() => {
    const initializeResume = async () => {
      if (action === 'use' && templateId && !currentResumeId) {
        try {
          setLoading(true);

          // Guest mode - save to Redis
          if (guestMode) {
            const guestResume = await saveGuestResume({
              title: 'Untitled Resume',
              template_id: templateId,
              content: cvData,
              customization: customization
            });

            if (guestResume) {
              setCurrentResumeId(guestResume.id);
              navigate(`/editor/${guestResume.id}`, { replace: true });
            }
          }
          // Authenticated mode - save to MongoDB
          else {
            console.log('Creating resume with template:', templateId);
            console.log('Request body:', {
              title: 'Untitled Resume',
              template_id: templateId,
              content: cvData,
              customization: customization
            });

            const response = await apiRequest(API_ENDPOINTS.RESUMES, {
              method: 'POST',
              body: JSON.stringify({
                title: 'Untitled Resume',
                template_id: templateId,
                content: cvData,
                customization: customization
              })
            });

            console.log('Create resume response:', response);

            if (response.success) {
              setCurrentResumeId(response.data._id || response.data.id);
              navigate(`/editor/${response.data._id || response.data.id}`, { replace: true });
            }
          }
        } catch (error) {
          console.error('Error creating resume:', error);
          console.error('Error details:', error.message);
          alert(`Failed to create resume: ${error.message}\n\nPlease check the browser console for more details.`);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeResume();
  }, [action, templateId, currentResumeId, guestMode]);

  // Load existing resume if editing
  useEffect(() => {
    const loadResume = async () => {
      if (currentResumeId && !action) {
        try {
          setLoading(true);

          // Guest mode - load from Redis
          if (guestMode) {
            const resume = await getGuestResume(currentResumeId);

            if (resume) {
              if (resume.content) {
                setCvData(resume.content);
              }
              if (resume.customization) {
                setCustomization(prev => ({ ...prev, ...resume.customization }));
              }
            }
          }
          // Authenticated mode - load from MongoDB
          else {
            const response = await apiRequest(API_ENDPOINTS.RESUME_BY_ID(currentResumeId));

            if (response.success && response.data) {
              const resume = response.data;
              if (resume.content) {
                setCvData(resume.content);
              }
              if (resume.customization) {
                setCustomization(prev => ({ ...prev, ...resume.customization }));
              }
            }
          }
        } catch (error) {
          console.error('Error loading resume:', error);
          alert('Failed to load resume.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadResume();
  }, [currentResumeId, guestMode]);

  // Auto-save functionality
  useEffect(() => {
    if (!currentResumeId) return;

    const timer = setTimeout(async () => {
      try {
        setSaveStatus('saving');

        // Guest mode - save to Redis
        if (guestMode) {
          await updateGuestResume(currentResumeId, {
            title: cvData.personal.fullName ? `${cvData.personal.fullName}'s Resume` : 'Untitled Resume',
            content: cvData,
            customization: customization
          });
        }
        // Authenticated mode - save to MongoDB
        else {
          await apiRequest(API_ENDPOINTS.RESUME_BY_ID(currentResumeId), {
            method: 'PUT',
            body: JSON.stringify({
              title: cvData.personal.fullName ? `${cvData.personal.fullName}'s Resume` : 'Untitled Resume',
              content: cvData,
              customization: customization
            })
          });
        }

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (error) {
        console.error('Error auto-saving:', error);
        setSaveStatus('error');
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [cvData, customization, currentResumeId, guestMode]);

  // Detect authentication change and migrate guest data
  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthenticated && isGuestMode()) {
        try {
          setLoading(true);
          const result = await migrateGuestData();

          if (result.success) {
            setGuestMode(false);
            alert(`Successfully migrated your resume(s)! You can now access them from your dashboard.`);
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error migrating guest data:', error);
          alert('Signed in successfully! However, failed to migrate your draft. Please save your resume again.');
          setGuestMode(false);
        } finally {
          setLoading(false);
        }
      }
    };

    handleAuthChange();
  }, [isAuthenticated]);

  const updatePersonalInfo = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = (category, skill) => {
    if (skill.trim()) {
      setCvData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill.trim()]
        }
      }));
    }
  };

  const removeSkill = (category, index) => {
    setCvData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: ''
    };
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addCertificate = () => {
    const newCert = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      link: '',
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      certificates: [...prev.certificates, newCert]
    }));
  };

  const updateCertificate = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      certificates: prev.certificates.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertificate = (id) => {
    setCvData(prev => ({
      ...prev,
      certificates: prev.certificates.filter(cert => cert.id !== id)
    }));
  };

  const addActivity = () => {
    const newActivity = {
      id: Date.now(),
      title: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));
  };

  const updateActivity = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      activities: prev.activities.map(activity =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    }));
  };

  const removeActivity = (id) => {
    setCvData(prev => ({
      ...prev,
      activities: prev.activities.filter(activity => activity.id !== id)
    }));
  };

  const exportToPDF = async () => {
    try {
      setSaveStatus('saving');

      // Dynamically import libraries to reduce initial bundle size
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // Get the resume preview element
      const resumeElement = document.querySelector('.resume-preview-page');
      if (!resumeElement) {
        throw new Error('Resume preview not found');
      }

      // Hide section controls during export
      const controls = document.querySelectorAll('.section-controls');
      controls.forEach(el => el.style.display = 'none');

      // Capture the resume as canvas
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF'
      });

      // Show controls again
      controls.forEach(el => el.style.display = 'flex');

      // Calculate dimensions for PDF
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download PDF
      const fileName = cvData.personal.fullName
        ? `${cvData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';

      pdf.save(fileName);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setSaveStatus('error');
      alert('Failed to export PDF. Please try again.');
    }
  };

  const exportToDOCX = async () => {
    if (!currentResumeId) {
      alert('Please save your resume first before exporting.');
      return;
    }

    if (guestMode) {
      alert('DOCX export is only available for logged-in users. Please sign in to use this feature.');
      return;
    }

    try {
      setSaveStatus('saving');

      // Use resumeService to export
      const { blob, filename } = await resumeService.exportDocx(currentResumeId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      setSaveStatus('error');
      alert('Failed to export DOCX. Please try again.');
    }
  };

  const saveDraft = async () => {
    if (!currentResumeId) {
      alert('No resume to save. Please create a resume first.');
      return;
    }

    try {
      setSaveStatus('saving');
      await apiRequest(API_ENDPOINTS.RESUME_BY_ID(currentResumeId), {
        method: 'PUT',
        body: JSON.stringify({
          title: cvData.personal.fullName ? `${cvData.personal.fullName}'s Resume` : 'Untitled Resume',
          content: cvData,
          customization: customization
        })
      });
      setSaveStatus('saved');
      alert('Resume saved successfully!');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveStatus('error');
      alert('Failed to save resume. Please try again.');
    }
  };

  const generateShareLink = async () => {
    if (!currentResumeId) {
      alert('Please save your resume first before generating share link.');
      return;
    }

    if (guestMode) {
      alert('Share link is only available for logged-in users. Please sign in to use this feature.');
      return;
    }

    try {
      setSaveStatus('saving');

      // Call backend API to generate share link with consent
      const response = await resumeService.generateShareLink(currentResumeId, {
        allowDownload: true,
        consent: true // Explicitly provide consent
      });

      const shareUrl = response.data.shareUrl;
      setShareLink(shareUrl);
      setShowShareModal(true);

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Error generating share link:', error);
      setSaveStatus('error');
      alert(error.message || 'Failed to generate share link. Please try again.');
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  const updateCustomization = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const moveSectionUp = (index) => {
    if (index > 0) {
      const newOrder = [...sectionOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setSectionOrder(newOrder);
    }
  };

  const moveSectionDown = (index) => {
    if (index < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setSectionOrder(newOrder);
    }
  };

  const toggleSectionVisibility = (sectionName) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const calculateProgress = () => {
    const requiredFields = [
      cvData.personal.fullName,
      cvData.personal.email,
      cvData.personal.phone,
      cvData.experience.some(exp => exp.jobTitle || exp.company),
      cvData.education.some(edu => edu.degree || edu.school),
      cvData.skills.technical.length > 0 || cvData.skills.soft.length > 0
    ];
    const filledCount = requiredFields.filter(Boolean).length;
    return Math.round((filledCount / requiredFields.length) * 100);
  };

  return (
    <div className="editor-page">
      {/* Header */}
      <header className="editor-header">
        <div className="editor-header-content">
          <Link to="/dashboard" className="btn-back">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 18l-8-8 8-8M2 10h16" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Dashboard</span>
          </Link>

          <div className="editor-title-section">
            <input
              type="text"
              className="resume-title-input"
              value={cvData.personal.fullName ? `${cvData.personal.fullName}'s Resume` : "My Professional Resume"}
              placeholder="Resume Title"
              readOnly
            />
            {saveStatus && (
              <span className={`save-status save-status-${saveStatus}`}>
                {saveStatus === 'saving' && '💾 Saving...'}
                {saveStatus === 'saved' && '✓ Saved'}
                {saveStatus === 'error' && '⚠ Error saving'}
              </span>
            )}
          </div>

          <div className="editor-actions">
            <button className="btn-action" onClick={() => setShowCustomization(!showCustomization)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke="#374151" strokeWidth="1.5"/>
                <path d="M14 8c0-.5-.1-1-.3-1.4l1.2-1.2-2-2-1.2 1.2c-.4-.2-.9-.3-1.4-.3-.5 0-1 .1-1.4.3L7.7 3.4l-2 2 1.2 1.2c-.2.4-.3.9-.3 1.4 0 .5.1 1 .3 1.4l-1.2 1.2 2 2 1.2-1.2c.4.2.9.3 1.4.3.5 0 1-.1 1.4-.3l1.2 1.2 2-2-1.2-1.2c.2-.4.3-.9.3-1.4z" stroke="#374151" strokeWidth="1.5"/>
              </svg>
              <span>Customize</span>
            </button>
            <button className="btn-action" onClick={generateShareLink}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 6l3-3m0 0l-3-3m3 3H6a4 4 0 00-4 4v1m4 5l-3 3m0 0l3 3m-3-3h8a4 4 0 004-4v-1" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Share</span>
            </button>
            <button className="btn-action" onClick={saveDraft}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM10 2v4H6V2m2 6h0" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Save</span>
            </button>
            <button className="btn-action btn-primary" onClick={exportToPDF}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8h8M4 4h8M4 12h5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Export PDF</span>
            </button>
            <button className="btn-action" onClick={exportToDOCX}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 10v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3m8-5l-2-2m0 0L6 5m2-2v10" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>DOCX</span>
            </button>
          </div>
        </div>
      </header>

      {/* Guest Mode Banner */}
      {guestMode && (
        <div className="guest-mode-banner">
          <div className="guest-banner-content">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 12a1 1 0 110-2 1 1 0 010 2zm1-4a1 1 0 01-2 0V6a1 1 0 112 0v4z" fill="#F59E0B"/>
            </svg>
            <div className="guest-banner-text">
              <strong>Guest Mode:</strong> Your resume will be saved temporarily for 24 hours.
              <Link to="/login" className="guest-banner-link">Sign in</Link> to save permanently.
            </div>
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="editor-main">
        {/* Left Sidebar - Form */}
        <div className="editor-sidebar">
          <div className="editor-tabs">
            <button
              className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Info
            </button>
            <button
              className={`tab ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              Experience
            </button>
            <button
              className={`tab ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              Education
            </button>
            <button
              className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              Skills
            </button>
            <button
              className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
            <button
              className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              Certificates
            </button>
            <button
              className={`tab ${activeTab === 'activities' ? 'active' : ''}`}
              onClick={() => setActiveTab('activities')}
            >
              Activities
            </button>
          </div>

          <div className="editor-form">
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="form-section">
                <h3 className="section-title">Personal Information</h3>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cvData.personal.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    value={cvData.personal.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={cvData.personal.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="New York, NY"
                    value={cvData.personal.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/johndoe"
                    value={cvData.personal.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Website/Portfolio</label>
                  <input
                    type="url"
                    placeholder="https://johndoe.com"
                    value={cvData.personal.website}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Professional Summary</label>
                  <textarea
                    rows="4"
                    placeholder="Brief description of your professional background and career goals..."
                    value={cvData.personal.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Work Experience */}
            {activeTab === 'experience' && (
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">Work Experience</h3>
                  <button className="btn-add" onClick={addExperience}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10m-5-5h10" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Add Experience</span>
                  </button>
                </div>

                {cvData.experience.map((exp, index) => (
                  <div key={exp.id} className="experience-item">
                    <div className="item-header">
                      <h4>Experience {index + 1}</h4>
                      {cvData.experience.length > 1 && (
                        <button
                          className="btn-remove"
                          onClick={() => removeExperience(exp.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Job Title *</label>
                      <input
                        type="text"
                        placeholder="Senior Software Engineer"
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Company *</label>
                      <input
                        type="text"
                        placeholder="TechCorp Inc."
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        placeholder="San Francisco, CA"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date *</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        />
                        <span>I currently work here</span>
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        rows="4"
                        placeholder="Describe your responsibilities and achievements..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {activeTab === 'education' && (
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">Education</h3>
                  <button className="btn-add" onClick={addEducation}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10m-5-5h10" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Add Education</span>
                  </button>
                </div>

                {cvData.education.map((edu, index) => (
                  <div key={edu.id} className="education-item">
                    <div className="item-header">
                      <h4>Education {index + 1}</h4>
                      {cvData.education.length > 1 && (
                        <button
                          className="btn-remove"
                          onClick={() => removeEducation(edu.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Degree *</label>
                      <input
                        type="text"
                        placeholder="Bachelor of Science in Computer Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>School/University *</label>
                      <input
                        type="text"
                        placeholder="Stanford University"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        placeholder="Stanford, CA"
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>GPA (Optional)</label>
                      <input
                        type="text"
                        placeholder="3.8/4.0"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        rows="3"
                        placeholder="Relevant coursework, honors, achievements..."
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {activeTab === 'skills' && (
              <div className="form-section">
                <h3 className="section-title">Skills</h3>

                {/* Technical Skills */}
                <div className="skills-category">
                  <h4>Technical Skills</h4>
                  <div className="form-group">
                    <label>Add Skill</label>
                    <input
                      type="text"
                      placeholder="JavaScript, React, Node.js..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill('technical', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <p className="form-hint">Press Enter to add a skill</p>
                  </div>
                  <div className="skills-list">
                    {cvData.skills.technical.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <button
                          className="skill-remove"
                          onClick={() => removeSkill('technical', index)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="skills-category">
                  <h4>Soft Skills</h4>
                  <div className="form-group">
                    <label>Add Skill</label>
                    <input
                      type="text"
                      placeholder="Leadership, Communication, Problem Solving..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill('soft', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="skills-list">
                    {cvData.skills.soft.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <button
                          className="skill-remove"
                          onClick={() => removeSkill('soft', index)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="skills-category">
                  <h4>Languages</h4>
                  <div className="form-group">
                    <label>Add Language</label>
                    <input
                      type="text"
                      placeholder="English (Native), Spanish (Fluent)..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill('languages', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="skills-list">
                    {cvData.skills.languages.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <button
                          className="skill-remove"
                          onClick={() => removeSkill('languages', index)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projects */}
            {activeTab === 'projects' && (
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">Projects</h3>
                  <button className="btn-add" onClick={addProject}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10m-5-5h10" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Add Project</span>
                  </button>
                </div>

                {cvData.projects.map((project, index) => (
                  <div key={project.id} className="project-item">
                    <div className="item-header">
                      <h4>Project {index + 1}</h4>
                      {cvData.projects.length > 1 && (
                        <button
                          className="btn-remove"
                          onClick={() => removeProject(project.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Project Name *</label>
                      <input
                        type="text"
                        placeholder="E-commerce Platform"
                        value={project.name}
                        onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        rows="3"
                        placeholder="Describe what the project does and your role..."
                        value={project.description}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Technologies Used</label>
                      <input
                        type="text"
                        placeholder="React, Node.js, MongoDB, AWS"
                        value={project.technologies}
                        onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Project Link</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username/project"
                        value={project.link}
                        onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="month"
                          value={project.startDate}
                          onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="month"
                          value={project.endDate}
                          onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certificates */}
            {activeTab === 'certificates' && (
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">Certificates & Licenses</h3>
                  <button className="btn-add" onClick={addCertificate}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10m-5-5h10" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Add Certificate</span>
                  </button>
                </div>

                {cvData.certificates.map((cert, index) => (
                  <div key={cert.id} className="certificate-item">
                    <div className="item-header">
                      <h4>Certificate {index + 1}</h4>
                      {cvData.certificates.length > 1 && (
                        <button
                          className="btn-remove"
                          onClick={() => removeCertificate(cert.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Certificate Name *</label>
                      <input
                        type="text"
                        placeholder="AWS Certified Solutions Architect"
                        value={cert.name}
                        onChange={(e) => updateCertificate(cert.id, 'name', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Issuing Organization *</label>
                      <input
                        type="text"
                        placeholder="Amazon Web Services"
                        value={cert.issuer}
                        onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Date Issued</label>
                      <input
                        type="month"
                        value={cert.date}
                        onChange={(e) => updateCertificate(cert.id, 'date', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Certificate Link</label>
                      <input
                        type="url"
                        placeholder="https://www.credly.com/badges/..."
                        value={cert.link}
                        onChange={(e) => updateCertificate(cert.id, 'link', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        rows="3"
                        placeholder="Brief description of what this certification covers..."
                        value={cert.description}
                        onChange={(e) => updateCertificate(cert.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activities */}
            {activeTab === 'activities' && (
              <div className="form-section">
                <div className="section-header">
                  <h3 className="section-title">Activities & Volunteering</h3>
                  <button className="btn-add" onClick={addActivity}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3v10m-5-5h10" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Add Activity</span>
                  </button>
                </div>

                {cvData.activities.map((activity, index) => (
                  <div key={activity.id} className="activity-item">
                    <div className="item-header">
                      <h4>Activity {index + 1}</h4>
                      {cvData.activities.length > 1 && (
                        <button
                          className="btn-remove"
                          onClick={() => removeActivity(activity.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Title/Role *</label>
                      <input
                        type="text"
                        placeholder="Volunteer Coordinator"
                        value={activity.title}
                        onChange={(e) => updateActivity(activity.id, 'title', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Organization *</label>
                      <input
                        type="text"
                        placeholder="Red Cross"
                        value={activity.organization}
                        onChange={(e) => updateActivity(activity.id, 'organization', e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="month"
                          value={activity.startDate}
                          onChange={(e) => updateActivity(activity.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="month"
                          value={activity.endDate}
                          onChange={(e) => updateActivity(activity.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        rows="3"
                        placeholder="Describe your role and contributions..."
                        value={activity.description}
                        onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="editor-preview">
          <div className="preview-header">
            <div>
              <h3>Live Preview - {currentTemplate.name}</h3>
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
                <span className="progress-text">{calculateProgress()}% Complete</span>
              </div>
            </div>
            <div className="preview-actions">
              <button className="btn-zoom">100%</button>
            </div>
          </div>

          <div className="preview-content">
            <div className="resume-preview-wrapper">
              <div className="resume-preview-page" style={{ '--template-color': currentTemplate.color }}>
                {/* Resume Header with Template Styling */}
                <div className="resume-header-styled" style={{ background: currentTemplate.gradient }}>
                  <EditableField
                    value={cvData.personal.fullName}
                    onChange={(val) => updatePersonalInfo('fullName', val)}
                    placeholder="Your Name"
                    className="resume-name-styled"
                    style={{ fontWeight: 700, fontSize: '32px', marginBottom: '8px', textAlign: 'center', color: '#FFFFFF' }}
                  />
                  <div className="resume-contact-styled">
                    <EditableField
                      value={cvData.personal.email}
                      onChange={(val) => updatePersonalInfo('email', val)}
                      placeholder="your.email@example.com"
                      style={{ display: 'inline-block', color: '#FFFFFF' }}
                    />
                    {(cvData.personal.email && cvData.personal.phone) && <span>•</span>}
                    <EditableField
                      value={cvData.personal.phone}
                      onChange={(val) => updatePersonalInfo('phone', val)}
                      placeholder="+1 (555) 000-0000"
                      style={{ display: 'inline-block', color: '#FFFFFF' }}
                    />
                    {((cvData.personal.email || cvData.personal.phone) && cvData.personal.location) && <span>•</span>}
                    <EditableField
                      value={cvData.personal.location}
                      onChange={(val) => updatePersonalInfo('location', val)}
                      placeholder="City, State"
                      style={{ display: 'inline-block', color: '#FFFFFF' }}
                    />
                  </div>
                  <div className="resume-links-styled">
                    <EditableField
                      value={cvData.personal.linkedin}
                      onChange={(val) => updatePersonalInfo('linkedin', val)}
                      placeholder="linkedin.com/in/yourprofile"
                      style={{ display: 'inline-block', color: '#FFFFFF', textDecoration: 'underline' }}
                    />
                    {(cvData.personal.linkedin && cvData.personal.website) && <span>•</span>}
                    <EditableField
                      value={cvData.personal.website}
                      onChange={(val) => updatePersonalInfo('website', val)}
                      placeholder="yourwebsite.com"
                      style={{ display: 'inline-block', color: '#FFFFFF', textDecoration: 'underline' }}
                    />
                  </div>
                </div>

                {/* Professional Summary */}
                {sectionVisibility.personal && (
                  <div className="resume-section-styled">
                    <div className="section-controls">
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionUp(sectionOrder.indexOf('personal'))}
                        disabled={sectionOrder.indexOf('personal') === 0}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionDown(sectionOrder.indexOf('personal'))}
                        disabled={sectionOrder.indexOf('personal') === sectionOrder.length - 1}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        className="section-control-btn visibility"
                        onClick={() => toggleSectionVisibility('personal')}
                        title="Hide Section"
                      >
                        👁️
                      </button>
                    </div>
                    <h2 className="section-title-styled">Professional Summary</h2>
                    <EditableField
                      value={cvData.personal.summary}
                      onChange={(val) => updatePersonalInfo('summary', val)}
                      placeholder="Click to add professional summary..."
                      multiline={true}
                      className="summary-text-styled"
                      style={{ lineHeight: 1.6, color: '#374151' }}
                    />
                  </div>
                )}

                {/* Experience */}
                {sectionVisibility.experience && (
                  <div className="resume-section-styled">
                    <div className="section-controls">
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionUp(sectionOrder.indexOf('experience'))}
                        disabled={sectionOrder.indexOf('experience') === 0}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionDown(sectionOrder.indexOf('experience'))}
                        disabled={sectionOrder.indexOf('experience') === sectionOrder.length - 1}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        className="section-control-btn visibility"
                        onClick={() => toggleSectionVisibility('experience')}
                        title="Hide Section"
                      >
                        👁️
                      </button>
                    </div>
                    <h2 className="section-title-styled">Work Experience</h2>
                    {cvData.experience.map(exp => (
                    <div key={exp.id} className="experience-item-styled">
                      <div className="experience-header-styled">
                        <div>
                          <EditableField
                            value={exp.jobTitle}
                            onChange={(val) => updateExperience(exp.id, 'jobTitle', val)}
                            placeholder="Job Title"
                            className="job-title-styled"
                            style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <EditableField
                              value={exp.company}
                              onChange={(val) => updateExperience(exp.id, 'company', val)}
                              placeholder="Company Name"
                              className="company-name-styled"
                              style={{ display: 'inline-block', color: '#6B7280' }}
                            />
                            {exp.location && <span>•</span>}
                            <EditableField
                              value={exp.location}
                              onChange={(val) => updateExperience(exp.id, 'location', val)}
                              placeholder="Location"
                              style={{ display: 'inline-block', color: '#6B7280' }}
                            />
                          </div>
                        </div>
                        <div className="date-range-styled">
                          {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - {
                            exp.current ? 'Present' :
                            exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : 'End Date'
                          }
                        </div>
                      </div>
                      <EditableField
                        value={exp.description}
                        onChange={(val) => updateExperience(exp.id, 'description', val)}
                        placeholder="Click to add job description and achievements..."
                        multiline={true}
                        className="experience-description-styled"
                        style={{ marginTop: '8px', lineHeight: 1.6, color: '#374151' }}
                      />
                    </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {sectionVisibility.education && (
                  <div className="resume-section-styled">
                    <div className="section-controls">
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionUp(sectionOrder.indexOf('education'))}
                        disabled={sectionOrder.indexOf('education') === 0}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionDown(sectionOrder.indexOf('education'))}
                        disabled={sectionOrder.indexOf('education') === sectionOrder.length - 1}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        className="section-control-btn visibility"
                        onClick={() => toggleSectionVisibility('education')}
                        title="Hide Section"
                      >
                        👁️
                      </button>
                    </div>
                    <h2 className="section-title-styled">Education</h2>
                    {cvData.education.map(edu => (
                    <div key={edu.id} className="education-item-styled">
                      <div className="education-header-styled">
                        <div>
                          <EditableField
                            value={edu.degree}
                            onChange={(val) => updateEducation(edu.id, 'degree', val)}
                            placeholder="Degree"
                            className="degree-name-styled"
                            style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <EditableField
                              value={edu.school}
                              onChange={(val) => updateEducation(edu.id, 'school', val)}
                              placeholder="School Name"
                              className="school-name-styled"
                              style={{ display: 'inline-block', color: '#6B7280' }}
                            />
                            {edu.location && <span>•</span>}
                            <EditableField
                              value={edu.location}
                              onChange={(val) => updateEducation(edu.id, 'location', val)}
                              placeholder="Location"
                              style={{ display: 'inline-block', color: '#6B7280' }}
                            />
                          </div>
                        </div>
                        <div className="date-range-styled">
                          {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - {
                            edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : 'Present'
                          }
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <span style={{ fontWeight: 600, color: '#374151' }}>GPA:</span>
                        <EditableField
                          value={edu.gpa}
                          onChange={(val) => updateEducation(edu.id, 'gpa', val)}
                          placeholder="3.8/4.0"
                          className="gpa-styled"
                          style={{ display: 'inline-block', color: '#6B7280' }}
                        />
                      </div>
                      <EditableField
                        value={edu.description}
                        onChange={(val) => updateEducation(edu.id, 'description', val)}
                        placeholder="Click to add coursework, honors, achievements..."
                        multiline={true}
                        className="education-description-styled"
                        style={{ marginTop: '8px', lineHeight: 1.6, color: '#374151' }}
                      />
                    </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {sectionVisibility.skills && (cvData.skills.technical.length > 0 || cvData.skills.soft.length > 0 || cvData.skills.languages.length > 0) && (
                  <div className="resume-section-styled">
                    <div className="section-controls">
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionUp(sectionOrder.indexOf('skills'))}
                        disabled={sectionOrder.indexOf('skills') === 0}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionDown(sectionOrder.indexOf('skills'))}
                        disabled={sectionOrder.indexOf('skills') === sectionOrder.length - 1}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        className="section-control-btn visibility"
                        onClick={() => toggleSectionVisibility('skills')}
                        title="Hide Section"
                      >
                        👁️
                      </button>
                    </div>
                    <h2 className="section-title-styled">Skills</h2>
                    <div className="skills-container-styled">
                      {cvData.skills.technical.length > 0 && (
                        <div className="skill-category-styled">
                          <h4>Technical Skills</h4>
                          <div className="skill-tags-styled">
                            {cvData.skills.technical.map((skill, index) => (
                              <span key={index} className="skill-tag-styled">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {cvData.skills.soft.length > 0 && (
                        <div className="skill-category-styled">
                          <h4>Soft Skills</h4>
                          <div className="skill-tags-styled">
                            {cvData.skills.soft.map((skill, index) => (
                              <span key={index} className="skill-tag-styled">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {cvData.skills.languages.length > 0 && (
                        <div className="skill-category-styled">
                          <h4>Languages</h4>
                          <div className="skill-tags-styled">
                            {cvData.skills.languages.map((skill, index) => (
                              <span key={index} className="skill-tag-styled">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {sectionVisibility.projects && (
                  <div className="resume-section-styled">
                    <div className="section-controls">
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionUp(sectionOrder.indexOf('projects'))}
                        disabled={sectionOrder.indexOf('projects') === 0}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionDown(sectionOrder.indexOf('projects'))}
                        disabled={sectionOrder.indexOf('projects') === sectionOrder.length - 1}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        className="section-control-btn visibility"
                        onClick={() => toggleSectionVisibility('projects')}
                        title="Hide Section"
                      >
                        👁️
                      </button>
                    </div>
                    <h2 className="section-title-styled">Projects</h2>
                    {cvData.projects.map(project => (
                    <div key={project.id} className="project-item-styled">
                      <EditableField
                        value={project.name}
                        onChange={(val) => updateProject(project.id, 'name', val)}
                        placeholder="Project Name"
                        className="project-name-styled"
                        style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}
                      />
                      <EditableField
                        value={project.description}
                        onChange={(val) => updateProject(project.id, 'description', val)}
                        placeholder="Click to add project description..."
                        multiline={true}
                        className="project-description-styled"
                        style={{ marginTop: '4px', lineHeight: 1.6, color: '#374151' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <strong>Technologies:</strong>
                        <EditableField
                          value={project.technologies}
                          onChange={(val) => updateProject(project.id, 'technologies', val)}
                          placeholder="React, Node.js, MongoDB"
                          className="project-tech-styled"
                          style={{ display: 'inline-block', color: '#6B7280' }}
                        />
                      </div>
                      <EditableField
                        value={project.link}
                        onChange={(val) => updateProject(project.id, 'link', val)}
                        placeholder="github.com/username/project"
                        className="project-link-styled"
                        style={{ marginTop: '4px', color: '#3B82F6', textDecoration: 'underline' }}
                      />
                    </div>
                    ))}
                  </div>
                )}

                {/* Certificates */}
                {sectionVisibility.certificates && (
                  <div className="resume-section-styled">
                    <div className="section-controls">
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionUp(sectionOrder.indexOf('certificates'))}
                        disabled={sectionOrder.indexOf('certificates') === 0}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionDown(sectionOrder.indexOf('certificates'))}
                        disabled={sectionOrder.indexOf('certificates') === sectionOrder.length - 1}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        className="section-control-btn visibility"
                        onClick={() => toggleSectionVisibility('certificates')}
                        title="Hide Section"
                      >
                        👁️
                      </button>
                    </div>
                    <h2 className="section-title-styled">Certifications</h2>
                    {cvData.certificates.map(cert => (
                    <div key={cert.id} className="certificate-item-styled">
                      <div className="certificate-header-styled">
                        <EditableField
                          value={cert.name}
                          onChange={(val) => updateCertificate(cert.id, 'name', val)}
                          placeholder="Certificate Name"
                          className="certificate-name-styled"
                          style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}
                        />
                        {cert.date && (
                          <span className="certificate-date-styled">
                            {new Date(cert.date).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}
                          </span>
                        )}
                      </div>
                      <EditableField
                        value={cert.issuer}
                        onChange={(val) => updateCertificate(cert.id, 'issuer', val)}
                        placeholder="Issuing Organization"
                        className="certificate-issuer-styled"
                        style={{ color: '#6B7280' }}
                      />
                      <EditableField
                        value={cert.description}
                        onChange={(val) => updateCertificate(cert.id, 'description', val)}
                        placeholder="Click to add certificate description..."
                        multiline={true}
                        className="certificate-description-styled"
                        style={{ marginTop: '4px', lineHeight: 1.6, color: '#374151' }}
                      />
                    </div>
                    ))}
                  </div>
                )}

                {/* Activities */}
                {sectionVisibility.activities && (
                  <div className="resume-section-styled">
                    <div className="section-controls">
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionUp(sectionOrder.indexOf('activities'))}
                        disabled={sectionOrder.indexOf('activities') === 0}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        className="section-control-btn"
                        onClick={() => moveSectionDown(sectionOrder.indexOf('activities'))}
                        disabled={sectionOrder.indexOf('activities') === sectionOrder.length - 1}
                        title="Move Down"
                      >
                        ↓
                      </button>
                      <button
                        className="section-control-btn visibility"
                        onClick={() => toggleSectionVisibility('activities')}
                        title="Hide Section"
                      >
                        👁️
                      </button>
                    </div>
                    <h2 className="section-title-styled">Activities & Volunteering</h2>
                    {cvData.activities.map(activity => (
                    <div key={activity.id} className="activity-item-styled">
                      <div className="activity-header-styled">
                        <EditableField
                          value={activity.title}
                          onChange={(val) => updateActivity(activity.id, 'title', val)}
                          placeholder="Activity Title"
                          className="activity-title-styled"
                          style={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}
                        />
                        {activity.startDate && (
                          <span className="date-range-styled">
                            {new Date(activity.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - {
                              activity.endDate ? new Date(activity.endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : 'Present'
                            }
                          </span>
                        )}
                      </div>
                      <EditableField
                        value={activity.organization}
                        onChange={(val) => updateActivity(activity.id, 'organization', val)}
                        placeholder="Organization Name"
                        className="activity-organization-styled"
                        style={{ color: '#6B7280' }}
                      />
                      <EditableField
                        value={activity.description}
                        onChange={(val) => updateActivity(activity.id, 'description', val)}
                        placeholder="Click to add activity description..."
                        multiline={true}
                        className="activity-description-styled"
                        style={{ marginTop: '4px', lineHeight: 1.6, color: '#374151' }}
                      />
                    </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Panel */}
      {showCustomization && (
        <div className="customization-overlay" onClick={() => setShowCustomization(false)}>
          <div className="customization-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header">
              <h3>Customize Your CV</h3>
              <button className="btn-close" onClick={() => setShowCustomization(false)}>×</button>
            </div>
            <div className="panel-body">
              <div className="customization-group">
                <label>Template</label>
                <div className="template-grid">
                  {Object.entries(templates).map(([id, template]) => (
                    <button
                      key={id}
                      className={`template-option ${templateId === id ? 'active' : ''}`}
                      onClick={() => {
                        window.location.href = `/editor?template=${id}`;
                      }}
                      title={template.name}
                    >
                      <div
                        className="template-preview"
                        style={{
                          background: template.gradient,
                          border: templateId === id ? '2px solid #4F46E5' : '2px solid #E5E7EB'
                        }}
                      />
                      <span className="template-name">{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="customization-group">
                <label>Font Family</label>
                <select value={customization.font} onChange={(e) => updateCustomization('font', e.target.value)}>
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>

              <div className="customization-group">
                <label>Font Size</label>
                <select value={customization.fontSize} onChange={(e) => updateCustomization('fontSize', e.target.value)}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="customization-group">
                <label>Color Scheme</label>
                <div className="color-options">
                  {['blue', 'green', 'purple', 'red', 'orange', 'gray'].map(color => (
                    <button
                      key={color}
                      className={`color-option color-${color} ${customization.colorScheme === color ? 'active' : ''}`}
                      onClick={() => updateCustomization('colorScheme', color)}
                    />
                  ))}
                </div>
              </div>

              <div className="customization-group">
                <label>Spacing</label>
                <select value={customization.spacing} onChange={(e) => updateCustomization('spacing', e.target.value)}>
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>

              <div className="customization-group">
                <label>Layout</label>
                <select value={customization.layout} onChange={(e) => updateCustomization('layout', e.target.value)}>
                  <option value="single-column">Single Column</option>
                  <option value="two-column">Two Column</option>
                  <option value="modern">Modern</option>
                </select>
              </div>

              <div className="customization-group">
                <label>Section Order</label>
                <div className="section-order-list">
                  {sectionOrder.map((section, index) => (
                    <div key={section} className="section-order-item">
                      <span className="section-name">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                      <div className="section-order-controls">
                        <button
                          onClick={() => moveSectionUp(index)}
                          disabled={index === 0}
                          className="btn-move"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveSectionDown(index)}
                          disabled={index === sectionOrder.length - 1}
                          className="btn-move"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Your CV</h3>
              <button className="btn-close" onClick={() => setShowShareModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Anyone with this link will be able to view your CV
              </p>
              <div className="share-link-container">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="share-link-input"
                />
                <button className="btn-copy" onClick={copyShareLink}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M11 2H4a2 2 0 00-2 2v7m4-5h7a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Copy
                </button>
              </div>
              <div className="share-options">
                <h4>Share via:</h4>
                <div className="share-buttons">
                  <button className="btn-share-social">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" fill="#1877F2"/>
                    </svg>
                    Facebook
                  </button>
                  <button className="btn-share-social">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M19.59 3.07a8.15 8.15 0 01-2.36.65 4.12 4.12 0 001.8-2.27c-.79.47-1.66.81-2.59 1A4.08 4.08 0 0013.55 1c-2.26 0-4.1 1.84-4.1 4.1 0 .32.04.63.1.93A11.64 11.64 0 011.64 1.9a4.08 4.08 0 001.27 5.47c-.68-.02-1.32-.21-1.88-.52v.05c0 1.99 1.42 3.65 3.3 4.03-.34.09-.71.14-1.08.14-.26 0-.52-.02-.77-.07.52 1.63 2.03 2.82 3.83 2.85A8.21 8.21 0 010 15.54a11.57 11.57 0 006.29 1.85c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.36-.01-.53A8.35 8.35 0 0020 3.07h-.41z" fill="#1DA1F2"/>
                    </svg>
                    Twitter
                  </button>
                  <button className="btn-share-social">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M18.52 0H1.476C.66 0 0 .645 0 1.44v17.12C0 19.355.66 20 1.476 20h17.044c.816 0 1.48-.645 1.48-1.44V1.44C20 .645 19.336 0 18.52 0zM5.934 17.04H2.967V7.5h2.97v9.54h-.003zM4.45 6.195c-.952 0-1.723-.775-1.723-1.73 0-.954.771-1.73 1.723-1.73.95 0 1.72.776 1.72 1.73 0 .955-.77 1.73-1.72 1.73zM17.04 17.04h-2.963v-4.64c0-1.105-.02-2.526-1.54-2.526-1.54 0-1.776 1.202-1.776 2.444v4.722H7.8V7.5h2.844v1.305h.04c.396-.75 1.364-1.54 2.808-1.54 3.003 0 3.557 1.977 3.557 4.547v5.228h-.008z" fill="#0077B5"/>
                    </svg>
                    LinkedIn
                  </button>
                </div>
              </div>
              <div className="share-settings">
                <label className="share-setting-item">
                  <input type="checkbox" defaultChecked />
                  <span>Allow viewers to download CV</span>
                </label>
                <label className="share-setting-item">
                  <input type="checkbox" />
                  <span>Require password to view</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;