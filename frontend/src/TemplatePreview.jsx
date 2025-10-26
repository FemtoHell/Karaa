import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './TemplatePreview.css';
import { API_ENDPOINTS, apiRequest } from './config/api';
import ResumePreview from './components/ResumePreview';

const TemplatePreview = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample CV data for preview
  const sampleData = {
    personal: {
      fullName: 'Nguyễn Văn Minh',
      email: 'nguyenvanminh@example.com',
      phone: '+84 (0) 912 345 678',
      location: 'Hà Nội, Việt Nam',
      linkedin: 'linkedin.com/in/nguyenvanminh',
      website: 'nguyenvanminh.dev',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&q=80',
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
        link: 'aws.amazon.com/certification',
        description: 'Chứng chỉ chuyên nghiệp về thiết kế và triển khai hệ thống phân tán trên AWS'
      }
    ]
  };

  // Fetch template data from API
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        console.log('Fetching template with ID:', templateId);
        
        // Use cached data for performance
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

  // Prepare customization object from template
  const customization = {
    font: template.typography?.headingFont || 'Inter',
    fontSize: 'medium',
    colorScheme: template.category || 'blue',
    spacing: 'normal',
    layout: template.layout?.type || 'single-column',
    templateId: template._id,
    photoStyle: template.photoConfig?.style || 'circle',
    photoPosition: template.photoConfig?.position || 'header'
  };

  // REMOVED: Old hardcoded render functions (lines 160-784)
  // Now using ResumePreview component for consistency

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
            <p>Preview with sample data • Layout: {template.layout?.type || 'single-column'}</p>
          </div>

          <button onClick={handleUseTemplate} className="btn-use-template-primary">
            Use This Template
          </button>
        </div>
      </header>

      {/* Preview Content */}
      <div className="preview-content">
        <div className="resume-preview-container">
          <ResumePreview
            cvData={sampleData}
            customization={customization}
            template={template}
            editable={false}
          />
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
