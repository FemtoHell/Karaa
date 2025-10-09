import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { AuthProvider } from './AuthContext';
import LandingPage from './LandingPage';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Features from './Features';
import Pricing from './Pricing';
import Testimonials from './Testimonials';
import Templates from './Templates';
import TemplatePreview from './TemplatePreview';
import Dashboard from './Dashboard';
import Editor from './Editor';
import Profile from './Profile';
import HelpPage from './HelpPage';
import OAuthCallback from './OAuthCallback';
import DragTest from './DragTest';
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
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/preview" element={<TemplatePreview />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/editor/:id" element={<Editor />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/drag-test" element={<DragTest />} />
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
