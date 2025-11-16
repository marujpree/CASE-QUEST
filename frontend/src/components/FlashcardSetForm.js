import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FlashcardSetForm.css';

function FlashcardSetForm({ userId, onSubmit, onCancel }) {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    description: '',
    generate: true,
    generationType: 'topic', // 'topic', 'notes', or 'pdf'
    topic: '',
    notes: '',
    pdfFile: null,
    count: 5
  });

  useEffect(() => {
    loadClasses();
  }, [userId]);

  const loadClasses = async () => {
    try {
      const response = await api.get(`/classes/user/${userId}`);
      setClasses(response.data);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData({
        ...formData,
        pdfFile: file
      });
    } else if (file) {
      alert('Please select a PDF file');
      e.target.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flashcard-set-form card">
      <h3>Create Flashcard Set</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Set Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Chapter 5 Study Guide"
          />
        </div>

        <div className="input-group">
          <label>Class (Optional)</label>
          <select name="classId" value={formData.classId} onChange={handleChange}>
            <option value="">No specific class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.code})
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of this flashcard set"
          />
        </div>

        <div className="input-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="generate"
              checked={formData.generate}
              onChange={handleChange}
            />
            Generate flashcards with AI
          </label>
        </div>

        {formData.generate && (
          <>
            <div className="input-group">
              <label>Generation Method</label>
              <select 
                name="generationType" 
                value={formData.generationType} 
                onChange={handleChange}
              >
                <option value="topic">From Topic</option>
                <option value="notes">From Your Notes</option>
                <option value="pdf">From PDF Upload</option>
              </select>
            </div>

            {formData.generationType === 'topic' && (
              <div className="input-group">
                <label>Topic for AI Generation *</label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required={formData.generate && formData.generationType === 'topic'}
                  placeholder="e.g., Cell Biology, World War II, Calculus"
                />
              </div>
            )}

            {formData.generationType === 'notes' && (
              <div className="input-group">
                <label>Your Study Notes *</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  required={formData.generate && formData.generationType === 'notes'}
                  placeholder="Paste your study notes here..."
                  rows="6"
                />
              </div>
            )}

            {formData.generationType === 'pdf' && (
              <div className="input-group">
                <label>Upload PDF File *</label>
                <input
                  type="file"
                  name="pdfFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required={formData.generate && formData.generationType === 'pdf'}
                />
                {formData.pdfFile && (
                  <small className="file-info">
                    Selected: {formData.pdfFile.name} ({(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </small>
                )}
              </div>
            )}

            <div className="input-group">
              <label>Number of Cards</label>
              <input
                type="number"
                name="count"
                value={formData.count}
                onChange={handleChange}
                min="1"
                max="20"
              />
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="submit" className="button">
            {formData.generate ? 'Generate Set' : 'Create Empty Set'}
          </button>
          <button type="button" onClick={onCancel} className="button-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default FlashcardSetForm;
