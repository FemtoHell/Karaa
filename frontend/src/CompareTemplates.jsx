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
      fullName: 'Nguyễn Văn Minh',
      email: 'nguyenvanminh@example.com',
      phone: '+84 (0) 912 345 678',
      location: 'Hà Nội, Việt Nam',
      linkedin: 'linkedin.com/in/nguyenvanminh',
      website: 'nguyenvanminh.dev',
      summary: 'Full-stack Developer với hơn 5 năm kinh nghiệm phát triển ứng dụng web và mobile. Chuyên sâu về React, Node.js, và các công nghệ cloud hiện đại. Đam mê xây dựng sản phẩm có tác động thực sự và dẫn dắt đội ngũ kỹ thuật.'
    },
    experience: [
      {
        id: 1,
        jobTitle: 'Senior Full-Stack Developer',
        company: 'VNG Corporation',
        location: 'TP. Hồ Chí Minh',
        startDate: '2022-03',
        endDate: 'Present',
        current: true,
        description: '• Dẫn dắt nhóm 6 kỹ sư phát triển nền tảng microservices phục vụ 10M+ người dùng\n• Tối ưu hiệu năng hệ thống, giảm 50% thời gian phản hồi API\n• Triển khai CI/CD pipeline và infrastructure as code với Docker & Kubernetes'
      },
      {
        id: 2,
        jobTitle: 'Full-Stack Developer',
        company: 'FPT Software',
        location: 'Hà Nội',
        startDate: '2020-01',
        endDate: '2022-02',
        current: false,
        description: '• Phát triển RESTful APIs sử dụng Node.js, Express và MongoDB\n• Xây dựng responsive web apps với React và Redux\n• Tích hợp payment gateway (VNPay, Momo) và third-party services'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Cử nhân Công nghệ Thông tin',
        school: 'Đại học Bách Khoa Hà Nội',
        location: 'Hà Nội',
        startDate: '2015-09',
        endDate: '2019-06',
        gpa: '3.6/4.0',
        description: 'Chuyên ngành: Kỹ thuật Phần mềm. Các môn học: Cấu trúc dữ liệu & Giải thuật, Lập trình Web, Cơ sở dữ liệu'
      }
    ],
    skills: {
      technical: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL', 'Redis'],
      soft: ['Lãnh đạo nhóm', 'Giao tiếp hiệu quả', 'Giải quyết vấn đề', 'Làm việc nhóm'],
      languages: ['Tiếng Việt (Bản ngữ)', 'Tiếng Anh (TOEIC 850)']
    },
    projects: [
      {
        id: 1,
        name: 'Nền tảng Thương mại Điện tử',
        description: 'Xây dựng full-stack e-commerce platform với tích hợp thanh toán online, quản lý kho, và real-time analytics',
        technologies: 'React, Node.js, MongoDB, Redis, VNPay API',
        link: 'github.com/nguyenvanminh/ecommerce-platform',
        startDate: '2023-03',
        endDate: '2023-12'
      }
    ],
    certificates: [
      {
        id: 1,
        name: 'AWS Certified Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        date: '2023-06',
        description: 'Chứng chỉ chuyên nghiệp về thiết kế và triển khai hệ thống phân tán trên AWS'
      }
    ],
    activities: [
      {
        id: 1,
        title: 'Open Source Contributor',
        organization: 'React Vietnam Community',
        startDate: '2021-01',
        current: true,
        description: 'Đóng góp cho các dự án mã nguồn mở trong React ecosystem. Tham gia tổ chức meetups và workshops'
      }
    ]
  };

  // Fetch all templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(`${API_ENDPOINTS.TEMPLATES}?skipCache=true`);
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
