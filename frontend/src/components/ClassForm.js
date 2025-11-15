import React, { useState } from 'react';
import './ClassForm.css';

function ClassForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    instructor: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="class-form card">
      <h3>Add New Class</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Class Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Introduction to Computer Science"
          />
        </div>

        <div className="input-group">
          <label>Course Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g., CS 101"
          />
        </div>

        <div className="input-group">
          <label>Instructor</label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            placeholder="e.g., Dr. Smith"
          />
        </div>

        <div className="input-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the class"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="button">
            Add Class
          </button>
          <button type="button" onClick={onCancel} className="button-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClassForm;
