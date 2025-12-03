import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

function Header({ user, onLogout }) {
  const { language, changeLanguage, t } = useContext(LanguageContext);
  
  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">
          <span className="n">N</span>
          <span className="l">L</span>
        </div>
        <h1>{t('appName')}</h1>
      </div>
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
            <button className="logout-btn" onClick={onLogout}>
              {t('logout')}
            </button>
          </div>
        ) : (
          <div className="user-menu">
            <span>{t('guest')}</span>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;