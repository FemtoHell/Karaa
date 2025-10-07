# Resume Builder - Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16+)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Server will start at: http://localhost:3000

### Alternative Start Methods
1. **Use batch file (Windows):**
   - Double-click `start-dev.bat`

2. **Use serve for static hosting:**
   ```bash
   npx serve -s . -l 4000
   ```
   Access at: http://localhost:4000

### Build for Production
```bash
npm run build
```

## 📱 Features

### ✅ Completed Features
- **Landing Page** - Professional marketing page with hero section
- **Navigation** - Fully functional routing between pages
- **Templates Page** - Browse resume templates
- **Login Page** - Authentication with social login options
- **Dashboard** - User dashboard with resume management
- **Advanced Editor** - Complete CV builder with 7 sections:
  - Personal Information (name, email, phone, links, summary)
  - Work Experience (add/remove multiple positions)
  - Education (degrees, schools, GPA, descriptions)
  - Skills (technical, soft skills, languages)
  - Projects (name, tech stack, links, descriptions)
  - Certificates (certifications, licenses, links)
  - Activities & Volunteering (roles, organizations)
- **Real-time Preview** - Live CV preview as you type
- **Auto-save** - Automatic saving to localStorage
- **Dynamic Forms** - Add/remove items, validation
- **Responsive Design** - Mobile and tablet optimized

### 🎨 Design Features
- Modern UI with Poppins font
- Color scheme: Purple (#4F46E5) primary theme
- SVG icons and illustrations
- Smooth animations and transitions
- Professional gradient backgrounds

### 📐 Tech Stack
- **Framework:** React 18.2.0
- **Router:** React Router DOM 6.8.1
- **Build Tool:** Vite 7.1.8
- **Styling:** Pure CSS with modern features
- **Development:** Hot module replacement

## 🗺️ Page Structure

```
/ (Landing Page)
├── /login (Login/Register)
├── /templates (Resume Templates)
├── /dashboard (User Dashboard)
├── /editor (Resume Editor)
└── /editor/:id (Edit specific resume)

Additional routes:
├── /create → Templates
├── /features → Landing Page
├── /pricing → Landing Page
├── /terms → Landing Page
└── /privacy → Landing Page
```

## 📁 File Structure
```
src/
├── components/
│   ├── LandingPage.jsx + .css
│   ├── Login.jsx + .css
│   ├── Templates.jsx + .css
│   ├── Dashboard.jsx + .css
│   └── Editor.jsx + .css
├── App.jsx + .css
├── main.jsx
└── index.css
```

## 🔧 Known Issues & Solutions

### Issue: Vite dev server hangs
**Solution:** Use alternative serve method
```bash
npx serve -s . -l 4000
```

### Issue: Port conflicts
**Solution:** Change port in vite.config.js or use available port

### Issue: CSS not loading
**Solution:** Verify CSS imports and file paths

## 🎯 Next Steps

### Potential Enhancements
1. **Backend Integration**
   - User authentication
   - Resume data persistence
   - PDF generation

2. **Advanced Features**
   - Real-time collaboration
   - Template marketplace
   - AI-powered content suggestions

3. **Performance**
   - Code splitting
   - Image optimization
   - Bundle analysis

## 📞 Troubleshooting

### Server won't start
1. Check if Node.js is installed: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: `rm -rf node_modules && npm install`
4. Try alternative port: Change port in vite.config.js

### Build fails
1. Check for TypeScript errors
2. Verify all imports are correct
3. Run linting: `npm run lint`

---

**Happy Coding! 🎉**