import React from 'react';
import { useLanguage } from './LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        className={`language-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
      >
        US
      </button>
      <button
        className={`language-btn ${language === 'vn' ? 'active' : ''}`}
        onClick={() => setLanguage('vn')}
      >
        VN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
