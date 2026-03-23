"use client";
import React, { createContext, useState, useEffect } from 'react';
import translations from '../i18n/translations';

// Create the language context
export const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [dynamicTranslations, setDynamicTranslations] = useState({});

  // Initialize language from localStorage or browser settings
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const finalLanguage = savedLanguage && translations[savedLanguage] ? savedLanguage : 'en';
    setLanguage(finalLanguage);

    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', finalLanguage);
  }, []);

  // Fetch IndicBert Translations when language changes
  useEffect(() => {
    if (language !== 'en') {
      const enStrings = [];
      const enKeys = [];

      // Flatten English dict for translation
      Object.keys(translations.en || {}).forEach(key => {
        if (typeof translations.en[key] === 'string') {
          enStrings.push(translations.en[key]);
          enKeys.push(key);
        } else if (typeof translations.en[key] === 'object') {
          Object.keys(translations.en[key]).forEach(subKey => {
            enStrings.push(translations.en[key][subKey]);
            enKeys.push(`${key}.${subKey}`);
          });
        }
      });

      fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: enStrings, target_lang: language })
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.translations) {
            const newDict = {};
            enKeys.forEach((key, index) => {
              newDict[key] = data.translations[index];
            });
            setDynamicTranslations(newDict);
          }
        })
        .catch(err => console.error("IndicBert translation failed:", err));
    } else {
      setDynamicTranslations({});
    }
  }, [language]);

  // Function to change language
  const changeLanguage = (lang) => {
    if (translations[lang] || lang) {
      setLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
      document.documentElement.setAttribute('lang', lang);
    }
  };

  // Function to get translated text
  const t = (key, defaultText) => {
    // 1. For hierarchical keys like 'general.email' or 'footer.aboutUs'
    if (key.includes('.')) {
      const [section, subKey] = key.split('.');
      // Static translations first (these are high quality, already in translations.js)
      if (translations[language] && translations[language][section] && translations[language][section][subKey]) {
        return translations[language][section][subKey];
      }
      // IndicBert dynamic fallback for missing keys
      if (language !== 'en' && dynamicTranslations[`${section}.${subKey}`]) {
        return dynamicTranslations[`${section}.${subKey}`];
      }
      // English fallback
      if (translations.en && translations.en[section] && translations.en[section][subKey]) {
        return translations.en[section][subKey];
      }
    }
    // 2. Direct flat keys (e.g. 'welcome', 'brainHealthTest')
    else {
      // Static translations first
      if (translations[language] && translations[language][key]) {
        return translations[language][key];
      }
      // Try nested 'general' section
      if (translations[language] && translations[language].general && translations[language].general[key]) {
        return translations[language].general[key];
      }
      // IndicBert dynamic fallback for missing keys
      if (language !== 'en' && dynamicTranslations[key]) {
        return dynamicTranslations[key];
      }
      // English fallback
      if (translations.en && translations.en[key]) {
        return translations.en[key];
      }
      if (translations.en && translations.en.general && translations.en.general[key]) {
        return translations.en.general[key];
      }
    }
    // Return defaultText or key if nothing found
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
