import React, { createContext, useState, useEffect } from 'react';
import translations from '../i18n/translations';

// Create the language context
export const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  // Initialize language from localStorage or browser settings
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const finalLanguage = savedLanguage && translations[savedLanguage] ? savedLanguage : 'en';
    setLanguage(finalLanguage);
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', finalLanguage);
  }, []);

  // Function to change language
  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
      document.documentElement.setAttribute('lang', lang);
    }
  };

  // Function to get translated text
  const t = (key) => {
    // For hierarchical keys like 'general.email' or 'footer.email'
    if (key.includes('.')) {
      const [section, subKey] = key.split('.');
      if (translations[language] && translations[language][section] && translations[language][section][subKey]) {
        return translations[language][section][subKey];
      }
      // Fallback to English
      if (translations.en && translations.en[section] && translations.en[section][subKey]) {
        return translations.en[section][subKey];
      }
    } 
    // For direct keys (backward compatibility)
    else if (translations[language] && translations[language][key]) {
      return translations[language][key];
    } 
    // Try to find in general section
    else if (translations[language] && translations[language].general && translations[language].general[key]) {
      return translations[language].general[key];
    }
    // Fallback to English
    else if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    else if (translations.en && translations.en.general && translations.en.general[key]) {
      return translations.en.general[key];
    }
    // Return the key itself if no translation found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};