import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AlertCard from '../components/AlertCard';
import EmailSimulator from '../components/EmailSimulator';
import './Alerts.css';

function Alerts({ userId }) {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showSimulator, setShowSimulator] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, [userId]);

  const loadAlerts = async () => {
    try {
      const response = await api.get(`/alerts/user/${userId}`);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      await api.patch(`/alerts/${alertId}/read`);
      loadAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleDelete = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await api.delete(`/alerts/${alertId}`);
        loadAlerts();
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.is_read;
    if (filter === 'read') return alert.is_read;
    return true;
  });

  return (
    <div className="alerts-page">
      <div className="page-header">
        <h2>Class Alerts</h2>
        <p>Important updates detected from your class emails</p>
      </div>

      <div className="alerts-toolbar">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({alerts.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({alerts.filter(a => !a.is_read).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({alerts.filter(a => a.is_read).length})
          </button>
        </div>
        <button 
          className="button"
          onClick={() => setShowSimulator(!showSimulator)}
        >
          {showSimulator ? 'Hide' : 'Show'} Email Simulator
        </button>
      </div>

      {showSimulator && (
        <EmailSimulator userId={userId} onEmailProcessed={loadAlerts} />
      )}

      {filteredAlerts.length === 0 ? (
        <div className="empty-state">
          <h3>No alerts found</h3>
          <p>When important class updates are detected from emails, they'll appear here.</p>
          <p>Try the email simulator to test the alert detection system!</p>
        </div>
      ) : (
        <div className="alerts-grid">
          {filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;
