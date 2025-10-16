import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';
import LandingPage from './LandingPage';
import Login from './Login';
import VerifyEmail from './VerifyEmail';
import ForgotPassword from './ForgotPassword';
import Features from './Features';
import Testimonials from './Testimonials';
import Templates from './Templates';
import TemplatePreview from './TemplatePreview';
import Dashboard from './Dashboard';
import Editor from './Editor';
import Profile from './Profile';
import HelpPage from './HelpPage';
import Guides from './Guides';
import OAuthCallback from './OAuthCallback';
import SharedResume from './SharedResume';
import DragTest from './DragTest';
import DragTestSimple from './DragTestSimple';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/features" element={<Features />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/preview" element={<TemplatePreview />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/editor/:id" element={<Editor />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/share/:shareId" element={<SharedResume />} />
              <Route path="/drag-test" element={<DragTest />} />
              <Route path="/drag-test-simple" element={<DragTestSimple />} />
              {/* Redirect missing routes to main pages */}
              <Route path="/create" element={<Templates />} />
              <Route path="/settings" element={<Profile />} />
              <Route path="/terms" element={<LandingPage />} />
              <Route path="/privacy" element={<LandingPage />} />
              <Route path="/contact" element={<LandingPage />} />
              <Route path="/about" element={<LandingPage />} />
              <Route path="/faq" element={<LandingPage />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
