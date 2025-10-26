import React from 'react';
import './MiniTemplatePreview.css';
import ResumePreview from './ResumePreview';

const MiniTemplatePreview = ({ template }) => {
  // Sample data matching ResumePreview expectations
  const sampleData = {
    personal: {
      fullName: 'Nguyễn Văn Minh',
      email: 'nguyenvanminh@example.com',
      phone: '+84 912 345 678',
      location: 'Hà Nội, Việt Nam',
      linkedin: 'linkedin.com/in/nguyenvanminh',
      website: 'nguyenvanminh.dev',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&q=80',
      summary: 'Full-stack Developer với hơn 5 năm kinh nghiệm phát triển ứng dụng web và mobile. Chuyên sâu về React, Node.js, và các công nghệ cloud hiện đại.'
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
        description: '• Dẫn dắt nhóm phát triển nền tảng microservices\n• Tối ưu hiệu năng hệ thống, giảm 50% thời gian phản hồi API'
      },
      {
        id: 2,
        jobTitle: 'Full-Stack Developer',
        company: 'FPT Software',
        location: 'Hà Nội',
        startDate: '2020-01',
        endDate: '2022-02',
        current: false,
        description: '• Phát triển RESTful APIs với Node.js và MongoDB\n• Xây dựng responsive web apps với React'
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
        description: 'Chuyên ngành: Kỹ thuật Phần mềm'
      }
    ],
    skills: {
      technical: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL'],
      soft: ['Lãnh đạo nhóm', 'Giao tiếp hiệu quả', 'Giải quyết vấn đề'],
      languages: ['Tiếng Việt (Bản ngữ)', 'Tiếng Anh (TOEIC 850)']
    },
    projects: [
      {
        id: 1,
        name: 'E-commerce Platform',
        description: 'Xây dựng nền tảng thương mại điện tử với tích hợp thanh toán online',
        technologies: 'React, Node.js, MongoDB, Redis',
        startDate: '2023-03',
        endDate: '2023-12'
      }
    ],
    certificates: [
      {
        id: 1,
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023-06'
      }
    ]
  };

  return (
    <div className="mini-template-wrapper">
      <div className="mini-resume-container">
        <ResumePreview
          cvData={sampleData}
          template={template}
          editable={false}
        />
      </div>
    </div>
  );
};

export default MiniTemplatePreview;
