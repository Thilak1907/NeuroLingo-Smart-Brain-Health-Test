"use client";
import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function Footer() {
  const { t } = useContext(LanguageContext);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>{t('footer.aboutUs')}</h3>
          <p>{t('footer.aboutUsText')}</p>
        </div>
        <div className="footer-section">
          <h3>{t('footer.contactUs')}</h3>
          <p>{t('footer.emailLabel')}: support@neurolingo.com</p>
          <p>{t('footer.phone')}: +91 9876543210</p>
        </div>
        <div className="footer-section">
          <h3>{t('footer.legal')}</h3>
          <a href="#privacy">{t('footer.privacyPolicy')}</a>
          <a href="#terms">{t('footer.termsOfService')}</a>
        </div>
      </div>
      <div className="copyright">
        &copy; {new Date().getFullYear()} {t('general.appName')} - {t('footer.copyright')}
      </div>
    </footer>
  );
}

export default Footer;