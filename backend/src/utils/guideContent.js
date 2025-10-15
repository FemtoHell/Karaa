// FR-6.1: Guide Content - Hướng dẫn viết CV theo ngành

const industryGuides = {
  'technology': {
    title: 'Hướng dẫn viết CV Công nghệ / IT',
    icon: '💻',
    sections: [
      {
        title: 'Technical Skills - Kỹ năng kỹ thuật',
        tips: [
          'Liệt kê ngôn ngữ lập trình theo mức độ thành thạo',
          'Framework & tools bạn đã sử dụng trong dự án thực tế',
          'Certifications: AWS, Azure, Google Cloud, etc.',
          'Sắp xếp theo tech stack của công ty bạn apply'
        ],
        example: {
          good: 'Programming Languages: JavaScript (Expert), Python (Advanced), Java (Intermediate)\nFrameworks: React.js, Node.js, Express, Django\nTools: Git, Docker, Kubernetes, Jenkins',
          bad: 'Biết lập trình, có kinh nghiệm về web development'
        }
      },
      {
        title: 'Projects - Dự án',
        tips: [
          'Mô tả dự án với kết quả cụ thể (số user, performance improvement)',
          'Tech stack sử dụng',
          'Vai trò của bạn trong team',
          'Link GitHub/Demo nếu có'
        ],
        example: {
          good: 'E-commerce Platform (React + Node.js)\n• Built scalable REST API serving 10,000+ daily users\n• Reduced page load time by 40% through code optimization\n• Implemented JWT authentication and payment gateway integration\nGitHub: github.com/username/project',
          bad: 'Làm website bán hàng online'
        }
      }
    ],
    keywords: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile', 'AI/ML', 'Data Science', 'QA/Testing']
  },

  'marketing': {
    title: 'Hướng dẫn viết CV Marketing',
    icon: '📱',
    sections: [
      {
        title: 'Achievements - Thành tựu đo lường được',
        tips: [
          'Sử dụng con số cụ thể (% tăng trưởng, ROI, engagement rate)',
          'Campaigns bạn đã chạy và kết quả',
          'Tools: Google Analytics, Facebook Ads, SEO tools',
          'Budget management experience'
        ],
        example: {
          good: 'Digital Marketing Campaign Manager\n• Increased social media engagement by 150% in 6 months\n• Managed $50K monthly ad budget with 3.5x ROI\n• Led SEO strategy resulting in 200% organic traffic growth\n• Tools: Google Ads, Facebook Business Manager, SEMrush',
          bad: 'Làm marketing cho công ty, chạy ads Facebook'
        }
      },
      {
        title: 'Content Creation',
        tips: [
          'Portfolio links (Blog posts, social media campaigns)',
          'Content performance metrics',
          'Các platform bạn có kinh nghiệm',
          'Writing & design skills'
        ]
      }
    ],
    keywords: ['Digital Marketing', 'Content Marketing', 'SEO', 'Social Media', 'Brand Management', 'Growth Hacking']
  },

  'design': {
    title: 'Hướng dẫn viết CV Design',
    icon: '🎨',
    sections: [
      {
        title: 'Portfolio - Quan trọng nhất!',
        tips: [
          'Link portfolio website (Behance, Dribbble, personal site)',
          'Mô tả 2-3 best projects với context và impact',
          'Case studies với before/after',
          'Client testimonials nếu có'
        ],
        example: {
          good: 'UI/UX Designer - Mobile Banking App\n• Redesigned user flow reducing checkout time by 35%\n• Conducted 20+ user interviews & usability tests\n• Created design system used across 5 product teams\n• Portfolio: behance.net/username\n• Tools: Figma, Sketch, Adobe XD',
          bad: 'Thiết kế UI/UX cho app, làm logo, banner'
        }
      },
      {
        title: 'Design Skills',
        tips: [
          'Tools expertise: Figma, Adobe Creative Suite, Sketch',
          'Specialized areas: UI/UX, Branding, Illustration, Motion',
          'Design thinking & user research experience',
          'Collaboration với developers'
        ]
      }
    ],
    keywords: ['UI/UX', 'Graphic Design', 'Product Design', 'Brand Identity', 'Motion Graphics', '3D Design']
  },

  'business': {
    title: 'Hướng dẫn viết CV Business / Quản lý',
    icon: '💼',
    sections: [
      {
        title: 'Leadership & Management',
        tips: [
          'Team size bạn đã manage',
          'Revenue/profit impact của initiatives bạn lead',
          'Strategic planning & execution',
          'Stakeholder management'
        ],
        example: {
          good: 'Business Development Manager\n• Led team of 8 sales representatives\n• Increased annual revenue from $2M to $5M (150% growth)\n• Negotiated partnerships with 15+ enterprise clients\n• Developed go-to-market strategy for new product line',
          bad: 'Quản lý team, tăng doanh thu cho công ty'
        }
      },
      {
        title: 'Business Analysis',
        tips: [
          'Data-driven decision making',
          'Financial modeling & forecasting',
          'Process improvement initiatives',
          'Tools: Excel, Power BI, Tableau, SQL'
        ]
      }
    ],
    keywords: ['Business Analyst', 'Project Manager', 'Product Manager', 'Consultant', 'Sales', 'Account Manager']
  },

  'finance': {
    title: 'Hướng dẫn viết CV Tài chính / Kế toán',
    icon: '💰',
    sections: [
      {
        title: 'Technical Competencies',
        tips: [
          'Certifications: CPA, CFA, ACCA, CMA',
          'Financial software: SAP, Oracle, QuickBooks',
          'Accounting standards: GAAP, IFRS',
          'Analysis tools: Excel (advanced), Power BI'
        ],
        example: {
          good: 'Senior Financial Analyst | CFA Level II Candidate\n• Built financial models for M&A valuations ($50M+ deals)\n• Automated monthly reporting reducing process time by 60%\n• Led annual budgeting process for $100M revenue division\n• Tools: Excel (VBA, Power Query), SAP FI/CO, Tableau',
          bad: 'Làm báo cáo tài chính, phân tích số liệu'
        }
      },
      {
        title: 'Regulatory & Compliance',
        tips: [
          'Audit experience',
          'Tax planning & compliance',
          'Risk management',
          'Internal controls'
        ]
      }
    ],
    keywords: ['Financial Analyst', 'Accountant', 'Auditor', 'Investment Banker', 'Risk Manager', 'Tax Specialist']
  },

  'healthcare': {
    title: 'Hướng dẫn viết CV Y tế / Sức khỏe',
    icon: '⚕️',
    sections: [
      {
        title: 'Clinical Experience',
        tips: [
          'Licenses & certifications (MD, RN, PharmD, etc.)',
          'Specializations & areas of expertise',
          'Patient outcomes & quality metrics',
          'Clinical procedures & technologies'
        ],
        example: {
          good: 'Registered Nurse | ICU Specialist | BSN, RN, CCRN\n• Provided critical care for 100+ ICU patients annually\n• Maintained 98% patient satisfaction score\n• Trained 15 new nurses in advanced life support protocols\n• Certifications: BLS, ACLS, PALS, CCRN',
          bad: 'Y tá làm việc tại bệnh viện, chăm sóc bệnh nhân'
        }
      },
      {
        title: 'Research & Publications',
        tips: [
          'Clinical trials participation',
          'Medical research publications',
          'Conference presentations',
          'Grant funding received'
        ]
      }
    ],
    keywords: ['Doctor', 'Nurse', 'Pharmacist', 'Medical Technician', 'Healthcare Administrator', 'Therapist']
  },

  'education': {
    title: 'Hướng dẫn viết CV Giáo dục',
    icon: '📚',
    sections: [
      {
        title: 'Teaching Experience',
        tips: [
          'Teaching certifications & credentials',
          'Grade levels & subjects taught',
          'Student outcomes & improvement metrics',
          'Curriculum development experience'
        ],
        example: {
          good: 'High School Math Teacher | Licensed Educator\n• Taught Algebra & Calculus to 120+ students annually\n• Improved average test scores by 25% over 2 years\n• Developed interactive curriculum using technology tools\n• Led after-school tutoring program (30 students)\n• Certifications: State Teaching License, TESOL',
          bad: 'Giáo viên dạy toán, có kinh nghiệm giảng dạy'
        }
      },
      {
        title: 'Educational Technology',
        tips: [
          'Online learning platforms: Moodle, Canvas, Google Classroom',
          'EdTech tools expertise',
          'Hybrid & remote teaching experience',
          'Student engagement strategies'
        ]
      }
    ],
    keywords: ['Teacher', 'Professor', 'Tutor', 'Education Administrator', 'Curriculum Developer', 'Education Consultant']
  },

  'creative': {
    title: 'Hướng dẫn viết CV Sáng tạo / Nghệ thuật',
    icon: '🎭',
    sections: [
      {
        title: 'Creative Portfolio',
        tips: [
          'Portfolio website/link là BẮT BUỘC',
          'Highlight best work với detailed case studies',
          'Client list & brands worked with',
          'Awards & recognition'
        ],
        example: {
          good: 'Content Creator & Video Editor\n• Created 200+ videos with 10M+ total views\n• Managed YouTube channel growing from 0 to 100K subscribers\n• Collaborated with brands: Nike, Samsung, Coca-Cola\n• Tools: Adobe Premiere Pro, After Effects, DaVinci Resolve\n• Portfolio: youtube.com/channel',
          bad: 'Làm video, edit phim, sáng tạo nội dung'
        }
      },
      {
        title: 'Creative Skills',
        tips: [
          'Medium expertise (Video, Photo, Audio, Writing)',
          'Software proficiency',
          'Style & genre specialization',
          'Collaboration & client management'
        ]
      }
    ],
    keywords: ['Writer', 'Video Editor', 'Photographer', 'Animator', 'Content Creator', 'Art Director']
  }
};

// General tips áp dụng cho mọi ngành
const generalTips = {
  title: 'Nguyên tắc chung cho mọi CV',
  tips: [
    {
      category: 'Định dạng & Trình bày',
      points: [
        '✅ Sử dụng font chuyên nghiệp: Inter, Roboto, Lato',
        '✅ Kích thước: 10-12pt cho nội dung, 14-16pt cho heading',
        '✅ Margin: 0.5-1 inch mỗi cạnh',
        '✅ Độ dài: 1 trang cho Junior (0-3 năm), 2 trang cho Senior',
        '❌ Tránh: Quá nhiều màu sắc, font fancy, clip art'
      ]
    },
    {
      category: 'Nội dung',
      points: [
        '✅ Bắt đầu mỗi bullet với action verbs: Developed, Led, Managed, Increased',
        '✅ Lượng hóa achievements: Số liệu, phần trăm, timeline',
        '✅ Tailored cho mỗi job posting (keywords từ JD)',
        '✅ Recent experience trước (reverse chronological)',
        '❌ Tránh: Typos, thông tin cá nhân không liên quan, objective statements chung chung'
      ]
    },
    {
      category: 'Sections cần có',
      points: [
        '1. Contact Information',
        '2. Professional Summary (2-3 câu về bạn là ai)',
        '3. Work Experience (quan trọng nhất!)',
        '4. Education',
        '5. Skills',
        '6. Projects/Portfolio (nếu relevant)',
        '7. Certifications',
        '8. Optional: Awards, Publications, Languages'
      ]
    }
  ]
};

// Action verbs theo category
const actionVerbs = {
  leadership: ['Led', 'Managed', 'Directed', 'Coordinated', 'Supervised', 'Mentored', 'Trained'],
  achievement: ['Achieved', 'Exceeded', 'Improved', 'Increased', 'Reduced', 'Delivered', 'Accelerated'],
  creation: ['Created', 'Developed', 'Designed', 'Built', 'Established', 'Launched', 'Initiated'],
  analysis: ['Analyzed', 'Evaluated', 'Researched', 'Identified', 'Assessed', 'Investigated', 'Discovered'],
  communication: ['Presented', 'Collaborated', 'Communicated', 'Negotiated', 'Consulted', 'Facilitated']
};

module.exports = {
  industryGuides,
  generalTips,
  actionVerbs
};
