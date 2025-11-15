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
          <div className="flashcard-label">
            {showAnswer ? 'Answer' : 'Question'}
          </div>
          <div className="flashcard-text">
            {showAnswer ? currentCard.answer : currentCard.question}
          </div>
          <div className="flashcard-difficulty">
            Difficulty: <span className={`difficulty-${currentCard.difficulty}`}>
              {currentCard.difficulty}
            </span>
          </div>
          <div className="flashcard-hint">
            Click to {showAnswer ? 'see question' : 'reveal answer'}
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
          Flip Card
        </button>
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
