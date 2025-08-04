// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useIdleTimer from './hooks/useIdleTimer';
import LoginPage       from './pages/LoginPage';
import DashboardTabs   from './components/DashboardTabs';
import NotFoundPage    from './pages/NotFoundPage';
import './styles/style.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleId, setRoleId]       = useState(null);

  // On first render, check localStorage
  useEffect(() => {
    const saved = localStorage.getItem('isLoggedIn') === 'true';
    const storedRole = localStorage.getItem('userRoleId');
    setIsLoggedIn(saved);
    if (storedRole) {
      setRoleId(Number(storedRole));
    }
  }, []);



  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    const newRole = Number(localStorage.getItem('userRoleId'));
    setRoleId(newRole);
  };

  const handleSignOut = () => {
    const sessionId = localStorage.getItem('sessionId');
    fetch('http://localhost:3000/sessions/logout', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ sessionId })
    });

    localStorage.removeItem('sessionId');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

 useIdleTimer(handleSignOut, 10 * 60 * 1000, isLoggedIn);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <header className="app-header">
        <h1>Recruitment Dashboard</h1>
        <button className="signout-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </header>

      <Routes>
        <Route path="/" element={<DashboardTabs roleId={roleId} />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
