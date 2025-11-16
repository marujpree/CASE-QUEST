import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FlashcardSetCard from '../components/FlashcardSetCard';
import FlashcardSetForm from '../components/FlashcardSetForm';
import FlashcardViewer from '../components/FlashcardViewer';
import './Flashcards.css';

function Flashcards({ userId }) {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);

  useEffect(() => {
    loadFlashcardSets();
  }, [userId]);

  const loadFlashcardSets = async () => {
    try {
      const response = await api.get(`/flashcard-sets/user/${userId}`);
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error loading flashcard sets:', error);
    }
  };

  const handleCreate = async (setData) => {
    try {
      if (setData.generate) {
        if (setData.generationType === 'pdf' && setData.pdfFile) {
          // Generate from PDF upload
          const formData = new FormData();
          formData.append('pdf', setData.pdfFile);
          formData.append('userId', userId);
          formData.append('classId', setData.classId || '');
          formData.append('title', setData.title);
          formData.append('description', setData.description);
          formData.append('count', setData.count || 5);

          await api.post('/flashcard-sets/generate-from-pdf', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else if (setData.generationType === 'notes' && setData.notes) {
          // Generate from notes
          await api.post('/flashcard-sets/generate', {
            userId,
            classId: setData.classId,
            title: setData.title,
            description: setData.description,
            notes: setData.notes,
            count: setData.count || 5
          });
        } else if (setData.generationType === 'topic' && setData.topic) {
          // Generate from topic
          await api.post('/flashcard-sets/generate', {
            userId,
            classId: setData.classId,
            title: setData.title,
            description: setData.description,
            topic: setData.topic,
            count: setData.count || 5
          });
        }
      } else {
        // Create empty set
        await api.post('/flashcard-sets', {
          userId,
          classId: setData.classId,
          title: setData.title,
          description: setData.description
        });
      }
      loadFlashcardSets();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating flashcard set:', error);
      alert(error.response?.data?.error || 'Error creating flashcard set');
    }
  };

  const handleDelete = async (setId) => {
    if (window.confirm('Are you sure you want to delete this flashcard set?')) {
      try {
        await api.delete(`/flashcard-sets/${setId}`);
        loadFlashcardSets();
      } catch (error) {
        console.error('Error deleting flashcard set:', error);
      }
    }
  };

  const handleView = (set) => {
    setSelectedSet(set);
  };

  const handleCloseViewer = () => {
    setSelectedSet(null);
  };

  return (
    <div className="flashcards-page">
      {selectedSet ? (
        <FlashcardViewer set={selectedSet} onClose={handleCloseViewer} />
      ) : (
        <>
          <div className="page-header">
            <div>
              <h2>Flashcard Sets</h2>
              <p>AI-generated study materials for your classes</p>
            </div>
            <button className="button" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Create Set'}
            </button>
          </div>

          {showForm && (
            <FlashcardSetForm
              userId={userId}
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          )}

          {flashcardSets.length === 0 ? (
            <div className="empty-state">
              <h3>No flashcard sets yet</h3>
              <p>Create your first set to start studying with AI-generated flashcards!</p>
            </div>
          ) : (
            <div className="grid">
              {flashcardSets.map(set => (
                <FlashcardSetCard
                  key={set.id}
                  set={set}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Flashcards;
