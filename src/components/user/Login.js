import React, { useState, useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';

function Login({ onLogin }) {
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');

  // Mock users for demo
  const users = [
    { id: 'user1', name: 'Test Patient', email: 'patient@example.com', password: 'password123', role: 'patient' },
    { id: 'doc1', name: 'Dr. Smith', email: 'doctor@example.com', password: 'doctor123', role: 'doctor', patients: ['user1'] }
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      u => u.email === loginData.email && u.password === loginData.password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      onLogin(userWithoutPassword);
      setError('');
    } else {
      setError(t('invalidCredentials'));
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }
    
    // In a real app, this would send data to a server
    const newUser = {
      id: `user${Date.now()}`,
      name: registerData.name,
      email: registerData.email,
      role: 'patient'
    };
    
    onLogin(newUser);
  };

  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <button 
          className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          {t('login')}
        </button>
        <button 
          className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          {t('register')}
        </button>
      </div>
      
      {activeTab === 'login' ? (
        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <h2>{t('loginToAccount')}</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input 
              type="email" 
              id="email" 
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input 
              type="password" 
              id="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn primary-btn">{t('login')}</button>
          <p className="form-hint">
            {t('demoCredentials')}
          </p>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleRegisterSubmit}>
          <h2>{t('createAccount')}</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="name">{t('fullName')}</label>
            <input 
              type="text" 
              id="name"
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">{t('email')}</label>
            <input 
              type="email" 
              id="reg-email"
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">{t('password')}</label>
            <input 
              type="password" 
              id="reg-password"
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">{t('confirmPassword')}</label>
            <input 
              type="password" 
              id="confirm-password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn primary-btn">{t('register')}</button>
        </form>
      )}
    </div>
  );
}

export default Login;