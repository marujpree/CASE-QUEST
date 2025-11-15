import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ClassCard from '../components/ClassCard';
import ClassForm from '../components/ClassForm';
import './Classes.css';

function Classes({ userId }) {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

  const handleCreate = async (classData) => {
    try {
      await api.post('/classes', { ...classData, userId });
      loadClasses();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class? All related alerts and flashcards will also be deleted.')) {
      try {
        await api.delete(`/classes/${classId}`);
        loadClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  return (
    <div className="classes-page">
      <div className="page-header">
        <div>
          <h2>My Classes</h2>
          <p>Manage your academic courses</p>
        </div>
        <button className="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Class'}
        </button>
      </div>

      {showForm && <ClassForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      {classes.length === 0 ? (
        <div className="empty-state">
          <h3>No classes yet</h3>
          <p>Add your first class to get started with ScholarSync!</p>
        </div>
      ) : (
        <div className="grid">
          {classes.map(classItem => (
            <ClassCard
              key={classItem.id}
              classData={classItem}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Classes;
