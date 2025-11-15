import React from 'react';
import './AlertCard.css';

function AlertCard({ alert, onMarkAsRead, onDelete }) {
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

  const getAlertColor = (type) => {
    switch (type) {
      case 'cancellation': return '#ff6b6b';
      case 'exam_change': return '#ffa502';
      case 'extra_credit': return '#2ed573';
      case 'assignment': return '#5352ed';
      case 'schedule_change': return '#ff4757';
      default: return '#667eea';
    }
  };

  return (
    <div className={`alert-card ${!alert.is_read ? 'unread' : ''}`}>
      <div className="alert-card-header">
        <div className="alert-type" style={{ backgroundColor: getAlertColor(alert.type) }}>
          <span className="alert-type-icon">{getAlertIcon(alert.type)}</span>
          <span className="alert-type-text">{alert.type.replace('_', ' ')}</span>
        </div>
        {!alert.is_read && <span className="unread-badge">New</span>}
      </div>
      
      <h3>{alert.title}</h3>
      
      {alert.class_name && (
        <div className="alert-class-name">📚 {alert.class_name}</div>
      )}
      
      <p className="alert-message">{alert.message}</p>
      
      {alert.email_from && (
        <div className="alert-email-info">
          <small>From: {alert.email_from}</small>
          {alert.email_subject && <small>Subject: {alert.email_subject}</small>}
        </div>
      )}
      
      <div className="alert-footer">
        <span className="alert-date">
          {new Date(alert.detected_at).toLocaleString()}
        </span>
        <div className="alert-actions">
          {!alert.is_read && (
            <button onClick={() => onMarkAsRead(alert.id)} className="button-secondary">
              Mark as Read
            </button>
          )}
          <button onClick={() => onDelete(alert.id)} className="button-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertCard;
