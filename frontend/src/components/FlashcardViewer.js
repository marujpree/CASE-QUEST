import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FlashcardViewer.css';

function FlashcardViewer({ set, onClose }) {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    loadFlashcards();
  }, [set.id]);

  const loadFlashcards = async () => {
    try {
      const response = await api.get(`/flashcards/set/${set.id}`);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleGotIt = async () => {
    if (!currentCard) return;
    try {
      await api.patch(`/flashcards/${currentCard.id}/review`, { status: 'got_it' });
      // Reload flashcards to get updated review status
      await loadFlashcards();
      // Move to next card
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleForgot = async () => {
    if (!currentCard) return;
    try {
      await api.patch(`/flashcards/${currentCard.id}/review`, { status: 'forgot' });
      // Reload flashcards to get updated review status
      await loadFlashcards();
      // Move to next card
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  if (flashcards.length === 0) {
    return (
      <div className="flashcard-viewer">
        <div className="viewer-header">
          <h2>{set.title}</h2>
          <button onClick={onClose} className="button-secondary">
            ← Back to Sets
          </button>
        </div>
        <div className="empty-state">
          <h3>No flashcards in this set yet</h3>
          <p>Add some flashcards to start studying!</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="flashcard-viewer">
      <div className="viewer-header">
        <div>
          <h2>{set.title}</h2>
          {set.class_name && <p className="viewer-class">📚 {set.class_name}</p>}
        </div>
        <button onClick={onClose} className="button-secondary">
          ← Back to Sets
        </button>
      </div>

      <div className="viewer-progress">
        <span>Card {currentIndex + 1} of {flashcards.length}</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          />
        </div>
      </div>

      <div 
        className={`flashcard ${showAnswer ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-content">
          <div className="flashcard-front">
            <div className="flashcard-label">Question</div>
            <div className="flashcard-text">
              {currentCard.question}
            </div>
            <div className="flashcard-hint">
              Click to reveal answer
            </div>
          </div>
          
          <div className="flashcard-back">
            <div className="flashcard-label">Answer</div>
            <div className="flashcard-text">
              {currentCard.answer}
            </div>
            <div className="flashcard-hint">
              Click to see question
            </div>
          </div>

          <div className="flashcard-meta">
            <div className="flashcard-difficulty">
              Difficulty: <span className={`difficulty-${currentCard.difficulty}`}>
                {currentCard.difficulty}
              </span>
            </div>
            {currentCard.review_status && currentCard.review_status !== 'not_reviewed' && (
              <div className="flashcard-review-status">
                Status: <span className={`review-${currentCard.review_status}`}>
                  {currentCard.review_status === 'got_it' ? '✓ Mastered' : '✗ Needs Review'}
                </span>
                {currentCard.mastery_score !== undefined && (
                  <span className="mastery-score"> ({currentCard.mastery_score}%)</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="viewer-controls">
        <button 
          onClick={handlePrevious} 
          disabled={currentIndex === 0}
          className="button-secondary"
        >
          ← Previous
        </button>
        <button onClick={handleFlip} className="button">
          {showAnswer ? 'Show Question' : 'Show Answer'}
        </button>
        {showAnswer && (
          <>
            <button 
              onClick={handleGotIt} 
              className="button-success"
            >
              ✓ I Got It
            </button>
            <button 
              onClick={handleForgot} 
              className="button-danger"
            >
              ✗ I Forgot
            </button>
          </>
        )}
        <button 
          onClick={handleNext} 
          disabled={currentIndex === flashcards.length - 1}
          className="button-secondary"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default FlashcardViewer;
