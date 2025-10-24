// FR-6.1: Guide Content - Hướng dẫn viết CV theo ngành

const industryGuides = {
  'technology': {
    title: 'Hướng dẫn viết CV Công nghệ / IT',
    icon: '💻',
    tips: [
      'Liệt kê ngôn ngữ lập trình theo mức độ thành thạo (Expert, Advanced, Intermediate)',
      'Highlight framework & tools bạn đã sử dụng trong dự án thực tế',
      'Thêm certifications: AWS, Azure, Google Cloud, Docker, Kubernetes',
      'Sắp xếp skills theo tech stack của công ty bạn apply',
      'Mô tả dự án với kết quả cụ thể (số user, performance improvement)',
      'Luôn đề cập tech stack sử dụng cho mỗi project',
      'Nêu rõ vai trò của bạn trong team (Lead, Senior, Junior)',
      'Thêm link GitHub/Demo/Portfolio nếu có',
      'Quantify achievements: "Improved performance by 40%", "Reduced load time from 3s to 1s"',
      'Sử dụng action verbs: Developed, Built, Implemented, Optimized, Architected'
    ],
    examples: {
      good: 'Software Engineer | Full Stack Developer\n\nTechnical Skills:\n• Languages: JavaScript (Expert), Python (Advanced), Java (Intermediate)\n• Frontend: React.js, Next.js, TypeScript, Redux, Tailwind CSS\n• Backend: Node.js, Express, Django, RESTful API, GraphQL\n• Database: MongoDB, PostgreSQL, Redis\n• DevOps: Docker, Kubernetes, AWS (EC2, S3, Lambda), CI/CD\n• Tools: Git, GitHub Actions, Jest, Webpack\n\nE-commerce Platform - Lead Developer (React + Node.js)\n• Built scalable REST API serving 10,000+ daily active users\n• Reduced page load time by 40% through code optimization and lazy loading\n• Implemented JWT authentication and Stripe payment gateway integration\n• Deployed on AWS using Docker containers with 99.9% uptime\n• GitHub: github.com/username/ecommerce-platform',
      bad: 'Lập trình viên\n\nKỹ năng: Biết lập trình, có kinh nghiệm về web development\n\nDự án: Làm website bán hàng online, code backend và frontend'
    },
    keywords: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile', 'AI/ML', 'Data Science', 'QA/Testing', 'Software Engineer', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker']
  },

  'marketing': {
    title: 'Hướng dẫn viết CV Marketing',
    icon: '📱',
    tips: [
      'Sử dụng con số cụ thể: % tăng trưởng, ROI, engagement rate, conversion rate',
      'Mô tả campaigns bạn đã chạy với kết quả đo lường được',
      'List marketing tools: Google Analytics, Facebook Ads Manager, SEMrush, HubSpot',
      'Highlight budget management experience (số tiền và ROI)',
      'Thêm portfolio links: Blog posts, social media campaigns, case studies',
      'Content performance metrics: Views, engagement, leads generated',
      'Các platform/channel bạn có kinh nghiệm: Facebook, Google, TikTok, LinkedIn',
      'Soft skills: Creativity, analytical thinking, storytelling',
      'A/B testing và data-driven decision making',
      'SEO/SEM expertise với measurable results'
    ],
    examples: {
      good: 'Digital Marketing Manager\n\n• Increased social media engagement by 150% in 6 months across Facebook, Instagram, TikTok\n• Managed $50K monthly ad budget with average 3.5x ROI\n• Led SEO strategy resulting in 200% organic traffic growth (from 10K to 30K monthly visitors)\n• Created content calendar and managed team of 3 content creators\n• Tools: Google Ads, Facebook Business Manager, SEMrush, Google Analytics, Mailchimp\n• Launched influencer campaign reaching 2M impressions with 8% engagement rate\n\nContent Marketing Specialist\n• Produced 50+ blog posts generating 100K+ monthly organic traffic\n• Email marketing campaigns with 25% open rate and 5% CTR (industry avg: 18%/2%)\n• Portfolio: medium.com/@username',
      bad: 'Marketing\n\nLàm marketing cho công ty, chạy ads Facebook, viết content, tăng engagement'
    },
    keywords: ['Digital Marketing', 'Content Marketing', 'SEO', 'Social Media', 'Brand Management', 'Growth Hacking', 'Email Marketing', 'Performance Marketing', 'Analytics', 'Copywriting']
  },

  'design': {
    title: 'Hướng dẫn viết CV Design',
    icon: '🎨',
    tips: [
      'Portfolio link là BẮT BUỘC: Behance, Dribbble, personal website',
      'Mô tả 2-3 best projects với context, process, và impact',
      'Case studies với before/after metrics',
      'Thêm client testimonials nếu có',
      'Tools expertise: Figma, Adobe Creative Suite (Photoshop, Illustrator, XD), Sketch',
      'Specialized areas: UI/UX, Product Design, Branding, Illustration, Motion Graphics',
      'Design thinking & user research methodology',
      'Collaboration experience với developers và product managers',
      'Quantify impact: "Increased user engagement by 35%", "Reduced drop-off rate by 20%"',
      'Accessibility (WCAG) và responsive design expertise'
    ],
    examples: {
      good: 'UI/UX Designer | Product Designer\n\nPortfolio: behance.net/username | dribbble.com/username\n\nMobile Banking App Redesign - Lead Designer\n• Redesigned user flow reducing checkout time by 35% and cart abandonment by 25%\n• Conducted 20+ user interviews, created personas, and ran 5 usability testing sessions\n• Created comprehensive design system (150+ components) used across 5 product teams\n• Collaborated with 10 developers using Figma and Zeplin for handoff\n• Result: 4.8★ App Store rating (up from 3.2★), 50% increase in daily active users\n\nTools: Figma (Expert), Adobe XD, Photoshop, Illustrator, Principle, InVision\nSkills: User Research, Wireframing, Prototyping, Design Systems, Accessibility (WCAG 2.1)',
      bad: 'Designer\n\nThiết kế UI/UX cho app mobile, làm logo và banner cho công ty, biết dùng Figma và Photoshop'
    },
    keywords: ['UI/UX', 'Graphic Design', 'Product Design', 'Brand Identity', 'Motion Graphics', '3D Design', 'Visual Design', 'User Research', 'Prototyping', 'Design Systems']
  },

  'business': {
    title: 'Hướng dẫn viết CV Business / Quản lý',
    icon: '💼',
    tips: [
      'Quantify team size bạn đã manage và reporting structure',
      'Revenue/profit impact: số tiền cụ thể và % growth',
      'Strategic initiatives bạn đã lead với measurable outcomes',
      'Stakeholder management: internal teams và external partners',
      'Data-driven decision making: tools và methodologies',
      'Financial modeling & forecasting experience',
      'Process improvement: before/after metrics',
      'Business tools: Excel (advanced), Power BI, Tableau, SQL, Salesforce',
      'Key achievements: cost savings, revenue growth, efficiency improvements',
      'Leadership style và team development accomplishments'
    ],
    examples: {
      good: 'Business Development Manager\n\n• Led team of 8 sales representatives, 2 account managers\n• Increased annual revenue from $2M to $5M (150% growth) in 18 months\n• Negotiated partnerships with 15+ enterprise clients (avg. deal size $200K)\n• Developed and executed go-to-market strategy for new SaaS product line\n• Improved sales cycle from 90 days to 45 days through process optimization\n• Managed $500K annual budget with 95% efficiency\n\nProduct Manager - Fintech Platform\n• Launched 3 major features serving 50K+ users with 85% adoption rate\n• Led cross-functional team of 12 (engineers, designers, marketers)\n• Increased user retention by 40% through data-driven product improvements\n• Tools: Jira, SQL, Mixpanel, Figma, Google Analytics',
      bad: 'Manager\n\nQuản lý team sales, tăng doanh thu cho công ty, làm việc với khách hàng'
    },
    keywords: ['Business Analyst', 'Project Manager', 'Product Manager', 'Consultant', 'Sales', 'Account Manager', 'Operations Manager', 'Strategy', 'Business Intelligence']
  },

  'finance': {
    title: 'Hướng dẫn viết CV Tài chính / Kế toán',
    icon: '💰',
    tips: [
      'Certifications là rất quan trọng: CPA, CFA, ACCA, CMA, FRM',
      'Financial software proficiency: SAP, Oracle, QuickBooks, Xero',
      'Accounting standards: GAAP, IFRS, VAS (Vietnam)',
      'Advanced Excel skills: VBA, Power Query, Pivot Tables, Financial Modeling',
      'Analysis & visualization tools: Power BI, Tableau, SQL',
      'Quantify financial impact: deal sizes, cost savings, revenue generated',
      'Audit experience: types of audits, companies audited, findings',
      'Tax planning & compliance expertise',
      'Risk management và internal controls implementation',
      'Regulatory compliance: SOX, SEC regulations, local tax laws'
    ],
    examples: {
      good: 'Senior Financial Analyst | CFA Level II Candidate\n\n• Built comprehensive financial models for M&A valuations ($50M+ deals)\n• Automated monthly financial reporting process reducing time by 60% (from 10 days to 4 days)\n• Led annual budgeting and forecasting process for $100M revenue division\n• Identified cost-saving opportunities worth $2M annually through variance analysis\n• Tools: Excel (VBA, Power Query, Advanced Formulas), SAP FI/CO, Tableau, SQL\n\nSenior Accountant | CPA\n• Managed full-cycle accounting for 15+ clients (total revenue $50M)\n• Prepared financial statements in compliance with GAAP and IFRS\n• Led external audits with Big 4 firms - zero material findings for 3 consecutive years\n• Implemented NetSuite ERP reducing month-end close from 15 to 7 days\n• Tax: Filed corporate tax returns, identified $500K in tax savings through R&D credits',
      bad: 'Kế toán\n\nLàm báo cáo tài chính, phân tích số liệu, kê khai thuế'
    },
    keywords: ['Financial Analyst', 'Accountant', 'Auditor', 'Investment Banker', 'Risk Manager', 'Tax Specialist', 'Controller', 'CFO', 'FP&A', 'Treasury']
  },

  'healthcare': {
    title: 'Hướng dẫn viết CV Y tế / Sức khỏe',
    icon: '⚕️',
    tips: [
      'Licenses & certifications phải được list rõ ràng: MD, RN, PharmD, license numbers',
      'Specializations và areas of expertise (ICU, ER, Pediatrics, Surgery, etc.)',
      'Patient outcomes & quality metrics: satisfaction scores, recovery rates',
      'Clinical procedures & technologies you are proficient in',
      'EMR/EHR systems: Epic, Cerner, Meditech',
      'Research: clinical trials, publications, conference presentations',
      'Continuing education: CME credits, additional training',
      'Patient volume: number of patients treated',
      'Compliance: HIPAA, quality standards, accreditation',
      'Leadership: team management, training, mentorship'
    ],
    examples: {
      good: 'Registered Nurse | ICU Specialist | BSN, RN, CCRN\nLicense: RN123456 (Active)\n\n• Provided critical care for 100+ ICU patients annually in 24-bed Level I Trauma Center\n• Maintained 98% patient satisfaction score (hospital avg: 92%)\n• Trained and mentored 15 new graduate nurses in advanced life support protocols\n• Implemented new pain management protocol reducing opioid use by 30%\n• Certifications: BLS, ACLS, PALS, CCRN (Critical Care Registered Nurse)\n• EMR: Epic (Expert), Cerner\n• Specialties: Cardiac care, Ventilator management, CRRT, ECMO\n\nPharmacist | Clinical Pharmacy Specialist\n• Reviewed 200+ medication orders daily ensuring safety and efficacy\n• Reduced medication errors by 45% through implementation of verification system\n• Conducted medication therapy management for 500+ patients\n• License: PharmD, RPh License #789',
      bad: 'Y tá\n\nLàm việc tại bệnh viện, chăm sóc bệnh nhân, có bằng đại học điều dưỡng'
    },
    keywords: ['Doctor', 'Nurse', 'Pharmacist', 'Medical Technician', 'Healthcare Administrator', 'Therapist', 'Physician', 'Surgeon', 'Clinical Research', 'Medical Imaging']
  },

  'education': {
    title: 'Hướng dẫn viết CV Giáo dục',
    icon: '📚',
    tips: [
      'Teaching certifications & credentials: Teaching License, TESOL, TEFL',
      'Grade levels & subjects taught with specificity',
      'Student outcomes & improvement metrics: test scores, pass rates',
      'Curriculum development và instructional design experience',
      'Class size và student demographics',
      'Educational technology: LMS platforms (Moodle, Canvas, Google Classroom)',
      'EdTech tools: Kahoot, Quizizz, Nearpod, interactive whiteboards',
      'Hybrid & remote teaching experience (especially post-COVID)',
      'Student engagement strategies với measurable impact',
      'Professional development: workshops attended, certifications earned'
    ],
    examples: {
      good: 'High School Math Teacher | Licensed Educator\nLicense: State Teaching License #12345\n\n• Taught Algebra II, Pre-Calculus, and AP Calculus to 120+ students annually (grades 10-12)\n• Improved average AP Calculus pass rate from 68% to 85% over 2 years\n• Developed interactive curriculum integrating Desmos, GeoGebra, and Khan Academy\n• Led after-school tutoring program serving 30 at-risk students (100% graduation rate)\n• Implemented flipped classroom model increasing student engagement by 40%\n• Technologies: Google Classroom, Zoom, Screencastify, Kahoot\n• Awards: Teacher of the Year 2023\n\nESL Teacher | TESOL Certified\n• Taught English to 200+ international students (15 countries, ages 18-45)\n• Achieved 95% student satisfaction rating across 20 courses\n• Created custom curriculum for business English and IELTS preparation\n• Online teaching: 500+ hours via Zoom with interactive activities',
      bad: 'Giáo viên\n\nDạy toán cho học sinh trung học, có kinh nghiệm giảng dạy nhiều năm'
    },
    keywords: ['Teacher', 'Professor', 'Tutor', 'Education Administrator', 'Curriculum Developer', 'Education Consultant', 'ESL Teacher', 'Instructional Designer', 'Academic Advisor']
  },

  'creative': {
    title: 'Hướng dẫn viết CV Sáng tạo / Nghệ thuật',
    icon: '🎭',
    tips: [
      'Portfolio website/link là BẮT BUỘC - đây là yếu tố quan trọng nhất!',
      'Highlight best work với detailed case studies và behind-the-scenes process',
      'Client list & brands/companies worked with',
      'Awards & recognition: competitions won, features, press mentions',
      'Quantify reach: views, followers, engagement, downloads',
      'Medium expertise: Video, Photography, Audio, Writing, Animation',
      'Software proficiency với level: Adobe Creative Suite, Final Cut, Logic Pro',
      'Style & genre specialization: Corporate, Documentary, Commercial, etc.',
      'Collaboration: teams worked with, client testimonials',
      'Revenue generated or budget managed for creative projects'
    ],
    examples: {
      good: 'Content Creator & Video Editor\n\nPortfolio: youtube.com/mychannel | vimeo.com/mywork\n\n• Created 200+ videos generating 10M+ total views and 500K+ engagements\n• Managed YouTube channel growing from 0 to 100K subscribers in 18 months\n• Collaborated with major brands: Nike, Samsung, Coca-Cola (combined budget $150K)\n• Average engagement rate: 8.5% (industry average: 3-5%)\n• Tools: Adobe Premiere Pro (Expert), After Effects, DaVinci Resolve, Photoshop\n• Specialties: Promotional videos, Product launches, Documentary-style storytelling\n\nFreelance Photographer & Retoucher\n• Shot 100+ commercial projects for 50+ clients (fashion, food, product photography)\n• Featured in: Vogue, Elle, National Geographic\n• Instagram: 75K followers with 6% engagement rate\n• Client satisfaction: 4.9/5.0 average rating (100+ reviews)\n• Equipment: Sony A7IV, Canon 5D Mark IV, Profoto lighting\n• Portfolio: instagram.com/photographer | website.com',
      bad: 'Content Creator\n\nLàm video, edit phim, chụp ảnh, sáng tạo nội dung cho social media'
    },
    keywords: ['Writer', 'Video Editor', 'Photographer', 'Animator', 'Content Creator', 'Art Director', 'Copywriter', 'Filmmaker', 'Illustrator', 'Voice Actor']
  }
};

// General tips áp dụng cho mọi ngành - flattened array for frontend
const generalTips = [
  // Định dạng & Trình bày
  '✅ Sử dụng font chuyên nghiệp: Inter, Roboto, Lato, Arial (tránh Comic Sans, Papyrus)',
  '✅ Kích thước chữ: 10-12pt cho nội dung, 14-16pt cho headings',
  '✅ Margin: 0.5-1 inch mỗi cạnh để dễ đọc',
  '✅ Độ dài: 1 trang cho Junior/Mid-level (0-5 năm), tối đa 2 trang cho Senior',
  '❌ Tránh: Quá nhiều màu sắc, font fancy, clip art, ảnh cá nhân (trừ khi yêu cầu)',

  // Nội dung
  '✅ Bắt đầu mỗi bullet point với action verbs mạnh: Developed, Led, Managed, Increased, Implemented',
  '✅ Lượng hóa achievements với số liệu cụ thể: phần trăm, số tiền, timeline, metrics',
  '✅ Tailor CV cho từng job posting - sử dụng keywords từ job description',
  '✅ Sắp xếp experience theo thứ tự reverse chronological (gần nhất trước)',
  '❌ Tránh: Typos, ngữ pháp sai, thông tin cá nhân không liên quan (tình trạng hôn nhân, tôn giáo)',
  '❌ Tránh: Objective statements chung chung như "Seeking a challenging position to utilize my skills"',

  // Sections cần có
  '1️⃣ Contact Information: Email, Phone, LinkedIn, GitHub/Portfolio (nếu relevant)',
  '2️⃣ Professional Summary: 2-3 câu highlight về bạn là ai và value bạn mang lại',
  '3️⃣ Work Experience: Section quan trọng nhất! Focus vào achievements, not responsibilities',
  '4️⃣ Education: Degree, University, Year (GPA nếu > 3.5)',
  '5️⃣ Skills: Technical skills, tools, languages',
  '6️⃣ Projects/Portfolio: Nếu relevant cho position (đặc biệt quan trọng cho tech/design/creative)',
  '7️⃣ Certifications: Professional certifications, licenses',
  '8️⃣ Optional: Awards, Publications, Languages, Volunteer Work',

  // Pro tips
  '💡 ATS-friendly: Sử dụng standard section headings, tránh tables/columns phức tạp',
  '💡 Proofread 3+ lần: Typos có thể loại CV của bạn ngay lập tức',
  '💡 PDF format: Submit CV dưới dạng PDF để giữ formatting nhất quán',
  '💡 File name: "FirstName_LastName_Resume.pdf" (not "resume_final_v3.pdf")'
];

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
