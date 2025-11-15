import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './EmailSimulator.css';

function EmailSimulator({ userId, onEmailProcessed }) {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    classId: '',
    from: 'professor@university.edu',
    subject: '',
    body: ''
  });

  const emailTemplates = [
    {
      name: 'Class Cancellation',
      subject: 'Class Cancelled - Monday',
      body: 'Hi students, class is cancelled on Monday due to a conference. We will resume on Wednesday.'
    },
    {
      name: 'Exam Rescheduled',
      subject: 'Important: Midterm Exam Moved',
      body: 'The midterm exam has been rescheduled from next Tuesday to next Thursday at the same time.'
    },
    {
      name: 'Extra Credit',
      subject: 'Extra Credit Opportunity',
      body: 'I am offering extra credit for students who attend the guest lecture on Friday. Worth 5 bonus points!'
    }
  ];

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTemplateSelect = (template) => {
    setFormData({
      ...formData,
      subject: template.subject,
      body: template.body
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/alerts/process-email', {
        userId,
        classId: formData.classId || null,
        from: formData.from,
        subject: formData.subject,
        body: formData.body
      });
      alert('Email processed! Check if an alert was created.');
      setFormData({
        classId: '',
        from: 'professor@university.edu',
        subject: '',
        body: ''
      });
      if (onEmailProcessed) {
        onEmailProcessed();
      }
    } catch (error) {
      console.error('Error processing email:', error);
      alert('Error processing email');
    }
  };

  return (
    <div className="email-simulator card">
      <h3>📧 Email Simulator</h3>
      <p className="simulator-description">
        Test the alert detection system by simulating incoming emails
      </p>

      <div className="templates">
        <label>Quick Templates:</label>
        <div className="template-buttons">
          {emailTemplates.map((template, index) => (
            <button
              key={index}
              type="button"
              className="button-secondary"
              onClick={() => handleTemplateSelect(template)}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Class (Optional)</label>
          <select name="classId" value={formData.classId} onChange={handleChange}>
            <option value="">General / No specific class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} ({cls.code})
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>From</label>
          <input
            type="email"
            name="from"
            value={formData.from}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Body</label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="button">
          Process Email
        </button>
      </form>
    </div>
  );
}

export default EmailSimulator;
