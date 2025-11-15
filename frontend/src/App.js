import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Flashcards from './pages/Flashcards';
import Alerts from './pages/Alerts';
import api from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Initialize with a default user for demo purposes
    const initUser = async () => {
      try {
        const response = await api.get('/users');
        if (response.data.length > 0) {
          setCurrentUser(response.data[0]);
        } else {
          // Create a demo user if none exists
          const newUser = await api.post('/users', {
            email: 'demo@scholarsync.com',
            name: 'Demo Student'
          });
          setCurrentUser(newUser.data);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };
    initUser();
  }, []);

  if (!currentUser) {
    return (
      <div className="loading">
        <h2>Loading ScholarSync...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>📚 ScholarSync</h1>
            <p className="tagline">Your Academic Co-Pilot</p>
          </div>
          <ul className="navbar-menu">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/alerts">Alerts</Link></li>
            <li><Link to="/classes">Classes</Link></li>
            <li><Link to="/flashcards">Flashcards</Link></li>
          </ul>
          <div className="navbar-user">
            <span>👤 {currentUser.name}</span>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard userId={currentUser.id} />} />
            <Route path="/alerts" element={<Alerts userId={currentUser.id} />} />
            <Route path="/classes" element={<Classes userId={currentUser.id} />} />
            <Route path="/flashcards" element={<Flashcards userId={currentUser.id} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
