import React from 'react';
import './ClassCard.css';

function ClassCard({ classData, onDelete }) {
  return (
    <div className="class-card card">
      <div className="class-header">
        <h3>{classData.name}</h3>
        {classData.code && <span className="class-code">{classData.code}</span>}
      </div>
      
      {classData.instructor && (
        <p className="class-instructor">👨‍🏫 {classData.instructor}</p>
      )}
      
      {classData.description && (
        <p className="class-description">{classData.description}</p>
      )}
      
      <div className="class-footer">
        <span className="class-date">
          Added {new Date(classData.created_at).toLocaleDateString()}
        </span>
        <button onClick={() => onDelete(classData.id)} className="button-danger">
          Delete
        </button>
      </div>
    </div>
  );
}

export default ClassCard;
