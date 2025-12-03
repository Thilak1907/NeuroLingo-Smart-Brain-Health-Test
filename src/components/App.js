import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Login from './user/Login';
import Dashboard from './Dashboard';
import { LanguageProvider } from '../contexts/LanguageContext';

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in from session storage
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
  };

  return (
    <LanguageProvider>
      <div className="app-container">
        <Header user={user} onLogout={handleLogout} />
        <main className="main-content">
          {!user ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Dashboard user={user} />
          )}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;