import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Flashcards from './pages/Flashcards';
import Alerts from './pages/Alerts';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Logo from './components/Logo';
import api from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token is still valid
        api.get('/auth/me')
          .then(response => {
            setCurrentUser(response.data.user);
          })
          .catch(() => {
            // Token invalid, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
            setCurrentUser(null);
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading Classify...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {currentUser ? (
          <>
            <nav className="navbar">
              <div className="navbar-brand">
                <Logo size={36} />
                <div className="brand-text">
                  <h1>Classify</h1>
                  <p className="tagline">Your Student Assistant</p>
                </div>
              </div>
              <ul className="navbar-menu">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/alerts">Alerts</Link></li>
                <li><Link to="/classes">Classes</Link></li>
                <li><Link to="/flashcards">Flashcards</Link></li>
                <li><Link to="/calendar">Calendar</Link></li>
              </ul>
              <div className="navbar-user">
                <div className="user-avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                  <span className="user-name">{currentUser.name}</span>
                </div>
                <button onClick={handleLogout} className="button-secondary" style={{ marginLeft: '10px', padding: '5px 10px' }}>
                  Logout
                </button>
              </div>
            </nav>

            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard userId={currentUser.id} />} />
                <Route path="/alerts" element={<Alerts userId={currentUser.id} />} />
                <Route path="/classes" element={<Classes userId={currentUser.id} />} />
                <Route path="/flashcards" element={<Flashcards userId={currentUser.id} />} />
                <Route path="/calendar" element={<Calendar userId={currentUser.id} />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/signup" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
