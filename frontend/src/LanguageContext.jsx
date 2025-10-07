import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'vn' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    // Header
    templates: 'Templates',
    features: 'Features',
    pricing: 'Pricing',
    testimonials: 'Testimonials',
    login: 'Login',
    createCVNow: 'Create CV Now',
    getStarted: 'Get Started',
    profile: 'Profile',
    browseTemplates: 'Browse Templates',

    // Hero Section
    heroTitle: 'Build Your Professional Resume in Minutes',
    heroSubtitle: 'Create ATS-friendly resumes with our easy-to-use builder. Choose from professional templates and land your dream job faster.',
    getStartedFree: 'Get Started Free',
    watchDemo: 'Watch Demo',
    noCreditCard: 'No credit card required',
    freeTemplates: 'Free templates',
    downloadPDF: 'Download as PDF',

    // Features Section
    whyChoose: 'Why Choose Our Resume Builder?',
    whyChooseSubtitle: 'Everything you need to create a professional resume that stands out',
    modernTemplates: 'Modern Templates',
    modernTemplatesDesc: 'Choose from dozens of professionally designed templates',
    easyCustomization: 'Easy Customization',
    easyCustomizationDesc: 'Customize colors, fonts, and layouts with simple clicks',
    oneClickExport: 'One-click Export',
    oneClickExportDesc: 'Download your resume in PDF, Word, or other formats',

    // Templates Section
    chooseTemplate: 'Choose Your Resume Template',
    chooseTemplateSubtitle: 'Pick from our professionally designed templates tailored for different industries and styles.',
    modernTemplatesCategory: 'Modern Templates',
    professionalTemplates: 'Professional Templates',
    creativeTemplates: 'Creative Templates',
    minimalistTemplates: 'Minimalist Templates',
    useTemplate: 'Use Template',
    browseAllTemplates: 'Browse All Templates',

    // Templates Page
    allCategories: 'All Categories',
    modern: 'Modern',
    professional: 'Professional',
    creative: 'Creative',
    minimalist: 'Minimalist',
    allColors: 'All Colors',
    blue: 'Blue',
    green: 'Green',
    purple: 'Purple',
    orange: 'Orange',
    red: 'Red',
    gray: 'Gray',
    searchPlaceholder: 'Search templates... (e.g. \'modern\', \'blue\', \'tech\', \'creative\')',
    newestFirst: 'Newest First',
    oldestFirst: 'Oldest First',
    mostPopular: 'Most Popular',
    nameAZ: 'Name A-Z',
    nameZA: 'Name Z-A',
    clearAllFilters: 'Clear All Filters',
    templatesFound: 'templates found',
    templateFound: 'template found',
    for: 'for',
    noTemplatesFound: 'No templates found',
    tryAdjustingFilters: 'Try adjusting your search terms or filters to find what you\'re looking for.',
    preview: 'Preview',
    useTemplateBtn: 'Use Template',
    signInToContinue: 'Sign in to Continue',
    pleaseLoginToView: 'Please login or register to view and use this template',
    createAccount: 'Create Account',

    // Testimonials Page
    successStories: 'Success Stories',
    successStoriesSubtitle: 'Join thousands of professionals who landed their dream jobs with ResumeBuilder',
    resumesCreated: 'Resumes Created',
    usersHired: 'Users Hired',
    averageRating: 'Average Rating',
    successRate: 'Success Rate',
    softwareEngineer: 'Software Engineer',
    marketingManager: 'Marketing Manager',
    uxDesigner: 'UX Designer',
    dataScientist: 'Data Scientist',
    productManager: 'Product Manager',
    fullStackDeveloper: 'Full Stack Developer',
    testimonial1: '"The professional templates made all the difference in standing out from other candidates."',
    testimonial2: '"Easy to use and the results were impressive. Got multiple interview calls!"',
    testimonial3: '"Best resume builder I\'ve used. Clean, professional, and super intuitive."',
    testimonial4: '"As someone with limited design skills, this tool was a lifesaver. The AI-powered suggestions helped me articulate my achievements better."',
    testimonial5: '"The analytics feature is brilliant! I could see which companies viewed my resume and tailor my follow-ups accordingly. Game changer!"',
    testimonial6: '"Creating multiple resume versions for different tech stacks was so easy. The export quality is top-notch. My resume looked professional both online and printed."',
    gotHiredAt: 'Got hired at {company}',
    jobOffersIn: '{count} job offers in {time}',
    tripledResponseRate: 'Tripled my response rate',
    landedJobAt: 'Landed job at {company}',
    interviewsScheduled: '{count}+ interviews scheduled',
    hiredAt: 'Hired at {company}',
    hearFromUsers: 'Hear From Our Users',
    videoTestimonial1Title: 'How to Create a Professional Resume That Gets Noticed',
    videoTestimonial1Desc: 'Learn the secrets of building a standout resume',
    videoTestimonial2Title: 'Resume Tips: From Application to Job Offer',
    videoTestimonial2Desc: 'Expert advice on crafting the perfect resume',
    videoTestimonial3Title: 'Resume Builder Tutorial: Step-by-Step Guide',
    videoTestimonial3Desc: 'Complete walkthrough of creating your resume',
    readyToWriteStory: 'Ready to Write Your Success Story?',
    joinProfessionals: 'Join 50,000+ professionals who transformed their careers',
    viewPricing: 'View Pricing',

    // Testimonials Section
    whatUsersSay: 'What Our Users Say',
    whatUsersSaySubtitle: 'Join thousands of professionals who landed their dream jobs',

    // CTA Section
    readyForJob: 'Ready to land your dream job?',
    readyForJobSubtitle: 'Start building your professional resume today - it\'s free!',
    createResumeNow: 'Create Your Resume Now',

    // Footer
    footerDescription: 'Create professional resumes that get you hired.',
    product: 'Product',
    support: 'Support',
    company: 'Company',
    helpCenter: 'Help Center',
    contact: 'Contact',
    faq: 'FAQ',
    about: 'About',
    privacy: 'Privacy',
    terms: 'Terms',
    allRightsReserved: 'All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',

    // Login/Register
    welcomeBack: 'Welcome Back',
    continueJourney: 'Continue your journey to create amazing resumes',
    backToHome: 'Back to Home',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot Password?',
    signIn: 'Sign In',
    or: 'OR',
    continueWithGoogle: 'Continue with Google',
    continueWithFacebook: 'Continue with Facebook',
    continueAsGuest: 'Continue as Guest',
    guestNote: 'Your data will be saved temporarily',
    byContinuing: 'By continuing, you agree to our',
    and: 'and',

    // Login Page Welcome
    welcomeToResumeBuilder: 'Welcome to ResumeBuilder',
    createProfessionalResumes: 'Create professional resumes that get you hired',

    // Dashboard
    welcomeBackUser: 'Welcome back',
    continueWorking: 'Continue working on your resumes or create a new one',
    createNewResume: 'Create New Resume',
    totalResumes: 'Total Resumes',
    recentUpdates: 'Recent Updates',
    downloads: 'Downloads',
    yourResumes: 'Your Resumes',
    searchResumes: 'Search resumes...',
    recentlyModified: 'Recently Modified',
    edit: 'Edit',
    download: 'Download',
    duplicate: 'Duplicate',
    share: 'Share',
    delete: 'Delete',
    createNew: 'Create New Resume',
    startFromScratch: 'Start from scratch or choose a template',
    recentActivity: 'Recent Activity',
    youEdited: 'You edited',
    youDownloaded: 'You downloaded',
    youCreated: 'You created',
    hoursAgo: 'hours ago',
    dayAgo: 'day ago',
    daysAgo: 'days ago',

    // Editor
    backToDashboard: 'Back to Dashboard',
    saveDraft: 'Save Draft',
    exportPDF: 'Export PDF',
    exportDOCX: 'Export DOCX',
    personalInfo: 'Personal Info',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certificates: 'Certificates',
    activities: 'Activities',
    livePreview: 'Live Preview',

    // Navigation
    dashboard: 'Dashboard',
    helpNotifications: 'Help & Notifications',
  },
  vn: {
    // Header
    templates: 'Mẫu CV',
    features: 'Tính năng',
    pricing: 'Bảng giá',
    testimonials: 'Đánh giá',
    login: 'Đăng nhập',
    createCVNow: 'Tạo CV ngay',
    getStarted: 'Bắt đầu',
    profile: 'Hồ sơ',
    browseTemplates: 'Xem mẫu',

    // Hero Section
    heroTitle: 'Tạo CV Chuyên Nghiệp Trong Vài Phút',
    heroSubtitle: 'Tạo CV thân thiện với ATS bằng công cụ dễ sử dụng của chúng tôi. Chọn từ các mẫu chuyên nghiệp và có được công việc mơ ước nhanh hơn.',
    getStartedFree: 'Bắt đầu miễn phí',
    watchDemo: 'Xem Demo',
    noCreditCard: 'Không cần thẻ tín dụng',
    freeTemplates: 'Mẫu miễn phí',
    downloadPDF: 'Tải xuống PDF',

    // Features Section
    whyChoose: 'Tại Sao Chọn Công Cụ Tạo CV Của Chúng Tôi?',
    whyChooseSubtitle: 'Mọi thứ bạn cần để tạo một CV chuyên nghiệp nổi bật',
    modernTemplates: 'Mẫu Hiện Đại',
    modernTemplatesDesc: 'Chọn từ hàng chục mẫu được thiết kế chuyên nghiệp',
    easyCustomization: 'Tùy Chỉnh Dễ Dàng',
    easyCustomizationDesc: 'Tùy chỉnh màu sắc, phông chữ và bố cục chỉ với vài cú nhấp chuột',
    oneClickExport: 'Xuất Một Cú Nhấp',
    oneClickExportDesc: 'Tải CV của bạn dưới định dạng PDF, Word hoặc các định dạng khác',

    // Templates Section
    chooseTemplate: 'Chọn Mẫu CV Của Bạn',
    chooseTemplateSubtitle: 'Chọn từ các mẫu được thiết kế chuyên nghiệp phù hợp với các ngành và phong cách khác nhau.',
    modernTemplatesCategory: 'Mẫu Hiện Đại',
    professionalTemplates: 'Mẫu Chuyên Nghiệp',
    creativeTemplates: 'Mẫu Sáng Tạo',
    minimalistTemplates: 'Mẫu Tối Giản',
    useTemplate: 'Sử dụng Mẫu',
    browseAllTemplates: 'Xem Tất Cả Mẫu',

    // Templates Page
    allCategories: 'Tất Cả Danh Mục',
    modern: 'Hiện Đại',
    professional: 'Chuyên Nghiệp',
    creative: 'Sáng Tạo',
    minimalist: 'Tối Giản',
    allColors: 'Tất Cả Màu',
    blue: 'Xanh Dương',
    green: 'Xanh Lá',
    purple: 'Tím',
    orange: 'Cam',
    red: 'Đỏ',
    gray: 'Xám',
    searchPlaceholder: 'Tìm kiếm mẫu... (ví dụ: \'hiện đại\', \'xanh\', \'công nghệ\', \'sáng tạo\')',
    newestFirst: 'Mới Nhất',
    oldestFirst: 'Cũ Nhất',
    mostPopular: 'Phổ Biến Nhất',
    nameAZ: 'Tên A-Z',
    nameZA: 'Tên Z-A',
    clearAllFilters: 'Xóa Tất Cả Bộ Lọc',
    templatesFound: 'mẫu được tìm thấy',
    templateFound: 'mẫu được tìm thấy',
    for: 'cho',
    noTemplatesFound: 'Không tìm thấy mẫu nào',
    tryAdjustingFilters: 'Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc để tìm những gì bạn đang tìm.',
    preview: 'Xem trước',
    useTemplateBtn: 'Sử dụng Mẫu',
    signInToContinue: 'Đăng nhập để Tiếp tục',
    pleaseLoginToView: 'Vui lòng đăng nhập hoặc đăng ký để xem và sử dụng mẫu này',
    createAccount: 'Tạo Tài Khoản',

    // Testimonials Page
    successStories: 'Câu Chuyện Thành Công',
    successStoriesSubtitle: 'Tham gia cùng hàng nghìn chuyên gia đã có được công việc mơ ước với ResumeBuilder',
    resumesCreated: 'CV Đã Tạo',
    usersHired: 'Người Dùng Được Tuyển',
    averageRating: 'Đánh Giá Trung Bình',
    successRate: 'Tỷ Lệ Thành Công',
    softwareEngineer: 'Kỹ Sư Phần Mềm',
    marketingManager: 'Quản Lý Marketing',
    uxDesigner: 'Nhà Thiết Kế UX',
    dataScientist: 'Nhà Khoa Học Dữ Liệu',
    productManager: 'Quản Lý Sản Phẩm',
    fullStackDeveloper: 'Lập Trình Viên Full Stack',
    testimonial1: '"Các mẫu chuyên nghiệp đã tạo ra sự khác biệt trong việc nổi bật so với các ứng viên khác."',
    testimonial2: '"Dễ sử dụng và kết quả thật ấn tượng. Đã nhận được nhiều cuộc gọi phỏng vấn!"',
    testimonial3: '"Công cụ tạo CV tốt nhất tôi từng dùng. Sạch sẽ, chuyên nghiệp và cực kỳ trực quan."',
    testimonial4: '"Là người có kỹ năng thiết kế hạn chế, công cụ này đã cứu tôi. Các gợi ý từ AI đã giúp tôi diễn đạt thành tích của mình tốt hơn."',
    testimonial5: '"Tính năng phân tích thật tuyệt vời! Tôi có thể thấy công ty nào đã xem CV của mình và điều chỉnh theo dõi phù hợp. Thay đổi cuộc chơi!"',
    testimonial6: '"Tạo nhiều phiên bản CV cho các ngăn xếp công nghệ khác nhau rất dễ dàng. Chất lượng xuất file tuyệt vời. CV của tôi trông chuyên nghiệp cả trực tuyến và in ấn."',
    gotHiredAt: 'Được tuyển tại {company}',
    jobOffersIn: '{count} đề nghị công việc trong {time}',
    tripledResponseRate: 'Tăng gấp 3 lần tỷ lệ phản hồi',
    landedJobAt: 'Nhận việc tại {company}',
    interviewsScheduled: 'Đã lên lịch {count}+ cuộc phỏng vấn',
    hiredAt: 'Được tuyển tại {company}',
    hearFromUsers: 'Nghe Từ Người Dùng Của Chúng Tôi',
    videoTestimonial1Title: 'Cách Tạo CV Chuyên Nghiệp Thu Hút Sự Chú Ý',
    videoTestimonial1Desc: 'Học bí quyết tạo CV nổi bật',
    videoTestimonial2Title: 'Mẹo CV: Từ Ứng Tuyển Đến Nhận Việc',
    videoTestimonial2Desc: 'Lời khuyên chuyên gia về tạo CV hoàn hảo',
    videoTestimonial3Title: 'Hướng Dẫn Tạo CV: Chi Tiết Từng Bước',
    videoTestimonial3Desc: 'Hướng dẫn đầy đủ về tạo CV của bạn',
    readyToWriteStory: 'Sẵn Sàng Viết Câu Chuyện Thành Công Của Bạn?',
    joinProfessionals: 'Tham gia cùng 50.000+ chuyên gia đã thay đổi sự nghiệp',
    viewPricing: 'Xem Bảng Giá',

    // Testimonials Section
    whatUsersSay: 'Người Dùng Nói Gì Về Chúng Tôi',
    whatUsersSaySubtitle: 'Tham gia cùng hàng nghìn chuyên gia đã có được công việc mơ ước',

    // CTA Section
    readyForJob: 'Sẵn sàng có được công việc mơ ước?',
    readyForJobSubtitle: 'Bắt đầu tạo CV chuyên nghiệp của bạn ngay hôm nay - hoàn toàn miễn phí!',
    createResumeNow: 'Tạo CV Ngay Bây Giờ',

    // Footer
    footerDescription: 'Tạo CV chuyên nghiệp giúp bạn được tuyển dụng.',
    product: 'Sản phẩm',
    support: 'Hỗ trợ',
    company: 'Công ty',
    helpCenter: 'Trung tâm Trợ giúp',
    contact: 'Liên hệ',
    faq: 'Câu hỏi thường gặp',
    about: 'Về chúng tôi',
    privacy: 'Quyền riêng tư',
    terms: 'Điều khoản',
    allRightsReserved: 'Đã đăng ký bản quyền.',
    privacyPolicy: 'Chính sách Bảo mật',
    termsOfService: 'Điều khoản Dịch vụ',

    // Login/Register
    welcomeBack: 'Chào Mừng Trở Lại',
    continueJourney: 'Tiếp tục hành trình tạo CV tuyệt vời của bạn',
    backToHome: 'Về Trang Chủ',
    emailAddress: 'Địa chỉ Email',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận Mật khẩu',
    rememberMe: 'Ghi nhớ đăng nhập',
    forgotPassword: 'Quên mật khẩu?',
    signIn: 'Đăng Nhập',
    or: 'HOẶC',
    continueWithGoogle: 'Tiếp tục với Google',
    continueWithFacebook: 'Tiếp tục với Facebook',
    continueAsGuest: 'Tiếp tục với Khách',
    guestNote: 'Dữ liệu của bạn sẽ được lưu tạm thời',
    byContinuing: 'Bằng cách tiếp tục, bạn đồng ý với',
    and: 'và',

    // Login Page Welcome
    welcomeToResumeBuilder: 'Chào mừng đến với ResumeBuilder',
    createProfessionalResumes: 'Tạo CV chuyên nghiệp giúp bạn được tuyển dụng',

    // Dashboard
    welcomeBackUser: 'Chào mừng trở lại',
    continueWorking: 'Tiếp tục làm việc với CV của bạn hoặc tạo mới',
    createNewResume: 'Tạo CV Mới',
    totalResumes: 'Tổng số CV',
    recentUpdates: 'Cập nhật Gần đây',
    downloads: 'Lượt tải xuống',
    yourResumes: 'CV Của Bạn',
    searchResumes: 'Tìm kiếm CV...',
    recentlyModified: 'Mới sửa đổi',
    edit: 'Chỉnh sửa',
    download: 'Tải xuống',
    duplicate: 'Nhân bản',
    share: 'Chia sẻ',
    delete: 'Xóa',
    createNew: 'Tạo CV Mới',
    startFromScratch: 'Bắt đầu từ đầu hoặc chọn mẫu',
    recentActivity: 'Hoạt động Gần đây',
    youEdited: 'Bạn đã chỉnh sửa',
    youDownloaded: 'Bạn đã tải xuống',
    youCreated: 'Bạn đã tạo',
    hoursAgo: 'giờ trước',
    dayAgo: 'ngày trước',
    daysAgo: 'ngày trước',

    // Editor
    backToDashboard: 'Về Bảng điều khiển',
    saveDraft: 'Lưu Nháp',
    exportPDF: 'Xuất PDF',
    exportDOCX: 'Xuất DOCX',
    personalInfo: 'Thông tin Cá nhân',
    experience: 'Kinh nghiệm',
    education: 'Học vấn',
    skills: 'Kỹ năng',
    projects: 'Dự án',
    certificates: 'Chứng chỉ',
    activities: 'Hoạt động',
    livePreview: 'Xem trước Trực tiếp',

    // Navigation
    dashboard: 'Bảng điều khiển',
    helpNotifications: 'Trợ giúp & Thông báo',
  }
};
