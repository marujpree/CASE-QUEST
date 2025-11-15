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

  useEffect(() => {
    loadDashboardData();
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

  const getAlertIcon = (type) => {
    switch (type) {
      case 'cancellation': return '🚫';
      case 'exam_change': return '📝';
      case 'extra_credit': return '⭐';
      case 'assignment': return '📄';
      case 'schedule_change': return '📅';
      default: return '📢';
    }
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's your academic overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3>{stats.alerts}</h3>
            <p>Total Alerts</p>
            {stats.unreadAlerts > 0 && (
              <span className="badge">{stats.unreadAlerts} unread</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.classes}</h3>
            <p>Active Classes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎴</div>
          <div className="stat-content">
            <h3>{stats.flashcardSets}</h3>
            <p>Flashcard Sets</p>
          </div>
        </div>
      </div>

      <div className="recent-alerts">
        <h3>Recent Alerts</h3>
        {recentAlerts.length === 0 ? (
          <div className="empty-state">
            <p>No alerts yet. When important class updates are detected, they'll appear here.</p>
          </div>
        ) : (
          <div className="alerts-list">
            {recentAlerts.map(alert => (
              <div key={alert.id} className={`alert-item ${!alert.is_read ? 'unread' : ''}`}>
                <div className="alert-icon">{getAlertIcon(alert.type)}</div>
                <div className="alert-content">
                  <h4>{alert.title}</h4>
                  <p className="alert-class">{alert.class_name || 'General'}</p>
                  <p className="alert-message">{alert.message.substring(0, 100)}...</p>
                  <span className="alert-time">
                    {new Date(alert.detected_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
