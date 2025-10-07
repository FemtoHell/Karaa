const Guide = require('../models/Guide');

const guides = [
  {
    title: 'How to Write a Tech Resume That Gets Noticed',
    slug: 'tech-resume-guide',
    industry: 'technology',
    category: 'resume-tips',
    description: 'Complete guide to creating an effective resume for tech positions including software engineering, data science, and IT roles.',
    content: `# How to Write a Tech Resume That Gets Noticed

A well-crafted tech resume is your ticket to landing interviews at top companies. Here's everything you need to know.

## Understanding What Tech Recruiters Look For

Tech recruiters spend an average of 6 seconds scanning each resume. Make those seconds count by highlighting your technical skills, projects, and measurable achievements.

## Essential Sections

1. **Technical Skills**: List programming languages, frameworks, tools, and technologies
2. **Projects**: Showcase your best work with links to GitHub/portfolio
3. **Experience**: Focus on impact and results using metrics
4. **Education**: Include relevant degrees and certifications

## Formatting Tips

- Keep it to 1-2 pages maximum
- Use a clean, ATS-friendly format
- Include keywords from the job description
- Quantify your achievements wherever possible`,
    sections: [
      {
        title: 'Technical Skills Section',
        content: 'Group skills by category: Languages, Frameworks, Tools, Cloud Platforms, Databases, etc.',
        order: 1
      },
      {
        title: 'Project Descriptions',
        content: 'Use the STAR method: Situation, Task, Action, Result. Include metrics and technologies used.',
        order: 2
      }
    ],
    tips: [
      {
        icon: '💡',
        title: 'Use Action Verbs',
        description: 'Start bullet points with strong verbs like "Developed", "Implemented", "Optimized"'
      },
      {
        icon: '📊',
        title: 'Quantify Everything',
        description: 'Use numbers: "Improved performance by 40%", "Reduced load time from 3s to 1s"'
      },
      {
        icon: '🔗',
        title: 'Link Your Work',
        description: 'Include GitHub, portfolio, and live project links'
      }
    ],
    dos: [
      'Tailor your resume for each application',
      'Use keywords from the job description',
      'Include links to your GitHub and portfolio',
      'List relevant side projects and open-source contributions',
      'Use a clean, ATS-friendly format'
    ],
    donts: [
      'Don\'t include irrelevant experience',
      'Avoid walls of text - use bullet points',
      'Don\'t lie about your skills',
      'Skip the objective statement',
      'Don\'t use overly complex designs'
    ],
    examples: [
      {
        title: 'Experience Description',
        good: 'Developed RESTful API using Node.js and MongoDB, reducing response time by 35% and serving 100K+ daily requests',
        bad: 'Worked on backend development using various technologies',
        explanation: 'The good example is specific, quantifiable, and shows impact'
      }
    ],
    tags: ['software-engineering', 'programming', 'tech-resume', 'developer'],
    author: {
      name: 'Sarah Chen',
      role: 'Senior Tech Recruiter',
      avatar: '/avatars/sarah.jpg'
    },
    readTime: 8,
    featured: true
  },
  {
    title: 'Healthcare Resume Best Practices',
    slug: 'healthcare-resume-guide',
    industry: 'healthcare',
    category: 'resume-tips',
    description: 'Expert guidance on creating resumes for healthcare professionals including nurses, doctors, and medical administrators.',
    content: `# Healthcare Resume Best Practices

Healthcare resumes require a unique approach that highlights certifications, clinical experience, and patient care skills.

## Key Components

Your healthcare resume should emphasize:
- Professional certifications and licenses
- Clinical skills and specializations
- Patient care experience
- EMR/EHR system proficiency
- Continuing education

## Format Recommendations

Use a traditional, professional format. Healthcare is a conservative field, so avoid creative designs.`,
    sections: [
      {
        title: 'Certifications',
        content: 'List all active licenses and certifications with expiration dates',
        order: 1
      },
      {
        title: 'Clinical Experience',
        content: 'Describe patient care responsibilities, procedures performed, and outcomes',
        order: 2
      }
    ],
    tips: [
      {
        icon: '🏥',
        title: 'Highlight Certifications',
        description: 'Place licenses and certifications prominently - they\'re often deal-breakers'
      },
      {
        icon: '📋',
        title: 'Use Medical Terminology',
        description: 'Include relevant medical terms and procedures you\'re qualified to perform'
      }
    ],
    dos: [
      'List all relevant certifications with license numbers',
      'Include specific clinical skills and procedures',
      'Mention EMR/EHR systems you\'ve used',
      'Highlight specialized training',
      'Include continuing education credits'
    ],
    donts: [
      'Don\'t forget to update license expiration dates',
      'Avoid mentioning expired certifications',
      'Don\'t use creative or colorful designs',
      'Skip personal information (age, marital status)'
    ],
    tags: ['healthcare', 'nursing', 'medical', 'clinical'],
    author: {
      name: 'Dr. Michael Roberts',
      role: 'Healthcare HR Director',
      avatar: '/avatars/michael.jpg'
    },
    readTime: 7,
    featured: true
  },
  {
    title: 'Finance Industry Resume Guide',
    slug: 'finance-resume-guide',
    industry: 'finance',
    category: 'resume-tips',
    description: 'How to create a compelling resume for banking, investment, and financial services positions.',
    content: `# Finance Industry Resume Guide

Breaking into finance requires a resume that demonstrates analytical skills, attention to detail, and quantifiable results.

## What Finance Employers Want

- Strong analytical and quantitative skills
- Financial modeling experience
- Knowledge of financial software and tools
- Proven track record with numbers
- Professional certifications (CFA, CPA, etc.)`,
    sections: [
      {
        title: 'Financial Skills',
        content: 'List financial modeling, analysis tools, and software proficiency',
        order: 1
      }
    ],
    tips: [
      {
        icon: '💰',
        title: 'Show Financial Impact',
        description: 'Use specific dollar amounts and percentages to show your impact'
      },
      {
        icon: '📈',
        title: 'Highlight Certifications',
        description: 'CFA, CPA, and other certifications are highly valued'
      }
    ],
    dos: [
      'Quantify financial achievements in dollars',
      'List relevant certifications (CFA, CPA, Series 7, etc.)',
      'Include financial modeling and analysis tools',
      'Mention specific deal sizes or portfolio values',
      'Use industry-specific terminology'
    ],
    donts: [
      'Don\'t be vague about financial results',
      'Avoid generic descriptions',
      'Don\'t omit relevant coursework if entry-level',
      'Skip unnecessary creative elements'
    ],
    tags: ['finance', 'banking', 'investment', 'accounting'],
    author: {
      name: 'Jennifer Walsh',
      role: 'Finance Talent Acquisition',
      avatar: '/avatars/jennifer.jpg'
    },
    readTime: 6,
    featured: false
  }
];

module.exports = guides;
