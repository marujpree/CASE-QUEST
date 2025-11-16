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
  const [classes, setClasses] = useState([]);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
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
      const userClasses = classesRes.data;
      const userFlashcardSets = flashcardsRes.data;

      setStats({
        alerts: alerts.length,
        classes: userClasses.length,
        flashcardSets: userFlashcardSets.length,
        unreadAlerts: unread
      });

      // Show only unread alerts in Today's Alerts section
      const unreadAlerts = alerts.filter(a => !a.is_read);
      setRecentAlerts(unreadAlerts.slice(0, 5));
      setClasses(userClasses);
      setFlashcardSets(userFlashcardSets);
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

  const handleMarkAsRead = async (alertId) => {
    try {
      await api.patch(`/alerts/${alertId}/read`);
      loadDashboardData(); // Reload to update the alerts list
    } catch (error) {
      console.error('Error marking alert as read:', error);
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
                      <span className="alert-meta">From: {alert.email_from || 'System'} • {new Date(alert.detected_at).toLocaleDateString()}</span>
                      <div className="alert-actions">
                        <button className="btn-mark-read" onClick={() => handleMarkAsRead(alert.id)}>Mark Read</button>
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
            {classes.length > 0 ? (
              <>
                <div className="flashcard-tabs">
                  {classes.slice(0, 3).map((cls, index) => (
                    <button 
                      key={cls.id} 
                      className={`tab-btn ${selectedClassIndex === index ? 'active' : ''}`}
                      onClick={() => setSelectedClassIndex(index)}
                    >
                      {cls.code}
                    </button>
                  ))}
                </div>

                <div className="flashcard-preview">
                  {(() => {
                    const selectedClass = classes[selectedClassIndex];
                    const classSets = flashcardSets.filter(set => set.class_id === selectedClass.id);
                    const totalCards = classSets.reduce((sum, set) => sum + (set.card_count || 0), 0);
                    
                    return (
                      <>
                        <p className="flashcard-meta">
                          {selectedClass.name} ({selectedClass.code}) — {classSets.length} flashcard set{classSets.length !== 1 ? 's' : ''}
                        </p>
                        {classSets.length > 0 ? (
                          <>
                            <p className="flashcard-question">
                              Total cards available: {totalCards}
                            </p>
                            <p className="flashcard-hint">
                              Start reviewing your {selectedClass.code} flashcards.
                            </p>
                            <button 
                              className="btn-primary"
                              onClick={() => window.location.href = '/flashcards'}
                            >
                              Start Study Session
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="flashcard-question">No flashcards yet for this class</p>
                            <p className="flashcard-hint">Create flashcards below to start studying.</p>
                            <button 
                              className="btn-primary"
                              onClick={() => window.location.href = '/flashcards'}
                            >
                              Create Flashcards
                            </button>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>No classes yet. Add classes to see your flashcard study options.</p>
                <button 
                  className="btn-primary"
                  onClick={() => window.location.href = '/classes'}
                  style={{ marginTop: '1rem' }}
                >
                  Add Classes
                </button>
              </div>
            )}
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
