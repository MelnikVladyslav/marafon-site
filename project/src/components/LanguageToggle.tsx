import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageToggleProps {
  className?: string;
  isMobile?: boolean;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '', isMobile = false }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  const buttonClasses = isMobile
    ? 'block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-[#30363d] rounded-md'
    : `text-gray-300 hover:text-white transition-colors ${className}`;

  return (
    <button
      onClick={toggleLanguage}
      className={buttonClasses}
      aria-label={language === 'en' ? 'Switch to Ukrainian' : 'Switch to English'}
    >
      {language === 'en' ? 'UA' : 'EN'}
    </button>
  );
};

export default LanguageToggle;
