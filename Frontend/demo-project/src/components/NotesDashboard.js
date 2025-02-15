import React, { useState } from 'react';
import './NotesDashboard.css'; // Assuming you have a CSS file for styling

const NotesDashboard = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>Close</button>
        <h1>Notes Dashboard</h1>
        <p>This is the notes dashboard popup. Here you can manage and view all your notes.</p>
        {/* Additional content and functionality can be added here */}
      </div>
    </div>
  );
};

export default NotesDashboard;
