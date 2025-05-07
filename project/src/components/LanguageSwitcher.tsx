import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center justify-center px-3 py-1 rounded-md bg-[#30363d] hover:bg-[#3c444d] transition-colors ${className}`}
      aria-label={`Switch to ${language === 'en' ? 'Ukrainian' : 'English'} language`}
    >
      <span className="font-medium">{language === 'en' ? 'UA' : 'EN'}</span>
    </button>
  );
};

export default LanguageSwitcher;
