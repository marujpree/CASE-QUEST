import React from 'react';
import './FlashcardSetCard.css';

function FlashcardSetCard({ set, onView, onDelete }) {
  return (
    <div className="flashcard-set-card card">
      <div className="set-icon">🎴</div>
      
      <h3>{set.title}</h3>
      
      {set.class_name && (
        <p className="set-class">📚 {set.class_name}</p>
      )}
      
      {set.description && (
        <p className="set-description">{set.description}</p>
      )}
      
      <div className="set-stats">
        <span className="card-count">{set.card_count || 0} cards</span>
      </div>
      
      <div className="set-footer">
        <span className="set-date">
          {new Date(set.created_at).toLocaleDateString()}
        </span>
        <div className="set-actions">
          <button onClick={() => onView(set)} className="button">
            Study
          </button>
          <button onClick={() => onDelete(set.id)} className="button-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlashcardSetCard;
