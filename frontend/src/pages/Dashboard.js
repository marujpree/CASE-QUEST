import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Dashboard.css';

function Dashboard({ userId }) {
  const [stats, setStats] = useState({
    alerts: 0,
    classes: 0,
    flashcardSets: 0,
    unreadAlerts: 0
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [generateMessage, setGenerateMessage] = useState('');

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      const [alertsRes, classesRes, flashcardsRes] = await Promise.all([
        api.get(`/alerts/user/${userId}`),
        api.get(`/classes/user/${userId}`),
        api.get(`/flashcard-sets/user/${userId}`)
      ]);

      const alerts = alertsRes.data;
      const unread = alerts.filter(a => !a.is_read).length;

      setStats({
        alerts: alerts.length,
        classes: classesRes.data.length,
        flashcardSets: flashcardsRes.data.length,
        unreadAlerts: unread
      });

      setRecentAlerts(alerts.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!topic && !notes) {
      setGenerateMessage('Please enter a topic or paste notes');
      return;
    }

    setLoading(true);
    setGenerateMessage('');

    try {
      const response = await api.post('/flashcards/generate', {
        userId,
        topic: topic || undefined,
        notes: notes || undefined,
        count: 10
      });

      setGenerateMessage(`✅ Successfully generated ${response.data.flashcards.length} flashcards!`);
      setTopic('');
      setNotes('');
      
      // Reload dashboard data
      setTimeout(() => {
        loadDashboardData();
      }, 1000);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setGenerateMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getAlertSeverity = (type) => {
    switch (type) {
      case 'cancellation': return 'high';
      case 'exam_change': return 'high';
      case 'extra_credit': return 'low';
      case 'assignment': return 'medium';
      case 'schedule_change': return 'medium';
      default: return 'medium';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-left">
          <div className="alerts-section">
            <div className="section-header">
              <h3>Today's Alerts</h3>
              {stats.unreadAlerts > 0 && (
                <span className="new-badge">{stats.unreadAlerts} New</span>
              )}
            </div>
            
            {recentAlerts.length === 0 ? (
              <div className="empty-state">
                <p>No alerts yet. When important class updates are detected, they'll appear here.</p>
              </div>
            ) : (
              <div className="alerts-list">
                {recentAlerts.map(alert => (
                  <div key={alert.id} className={`alert-card ${getAlertSeverity(alert.type)}`}>
                    <div className="alert-card-header">
                      <span className="alert-class-tag">{alert.class_name || 'General'}</span>
                      <span className={`severity-badge ${getAlertSeverity(alert.type)}`}>
                        {getAlertSeverity(alert.type).charAt(0).toUpperCase() + getAlertSeverity(alert.type).slice(1)}
                      </span>
                    </div>
                    <h4 className="alert-title">{alert.title}</h4>
                    <p className="alert-description">{alert.message.substring(0, 80)}</p>
                    <div className="alert-footer">
                      <span className="alert-meta">From: Prof. Name • {new Date(alert.detected_at).toLocaleDateString()}</span>
                      <div className="alert-actions">
                        <button className="btn-mark-read">Mark Read</button>
                        <button className="btn-add-calendar">Add to Calendar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-right">
          <div className="quick-study-section">
            <h3>Quick Study</h3>
            <div className="flashcard-tabs">
              <button className="tab-btn active">PSYC 2301</button>
              <button className="tab-btn">Calculus II</button>
              <button className="tab-btn">CS 101</button>
            </div>

            <div className="flashcard-preview">
              <p className="flashcard-meta">PSYC 2301 — Flashcards due today: 8</p>
              <p className="flashcard-question">Q: What is classical conditioning?</p>
              <p className="flashcard-hint">Tap "Start Session" to review 5 cards.</p>
              <button className="btn-primary">Start 5-card Session</button>
            </div>
          </div>

          <div className="create-flashcards-section">
            <h3>Create Flashcards</h3>
            <input 
              type="text" 
              placeholder="Topic name (e.g., Elasticity)" 
              className="form-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <textarea 
              placeholder="Paste your notes here..." 
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
            <button 
              className="btn-primary"
              onClick={handleGenerateFlashcards}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Flashcards'}
            </button>
            {generateMessage && (
              <p className={`form-message ${generateMessage.includes('❌') ? 'error' : 'success'}`}>
                {generateMessage}
              </p>
            )}
            <p className="form-hint">AI will create 10 flashcards from your notes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
