"use client";
import React, { useContext } from 'react';
import Link from 'next/link';
import { LanguageContext } from '../contexts/LanguageContext';
import { UserContext } from '../contexts/UserContext';

function Header() {
  const { language, changeLanguage, t } = useContext(LanguageContext);
  const { user, logout } = useContext(UserContext);

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <header className="header">
      <Link href="/" className="header-logo" style={{ textDecoration: 'none' }}>
        <div className="logo-icon">
          <span className="n">N</span>
          <span className="l">L</span>
        </div>
        <h1>{t('appName')}</h1>
      </Link>
      <nav className="nav-menu">
        <select
          className="language-selector"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="bn">বাংলা (Bengali)</option>
        </select>
        {user ? (
          <div className="user-menu">
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={logout}>
              {t('logout')}
            </button>
          </div>
        ) : (
          <div className="user-menu">
            <span>{t('guest')}</span>
          </div>
        )}
      </nav>
    </header >
  );
}

export default Header;