import React from 'react';
import './BookCard.css';

const BookCard = ({ title, author, description, imageUrl, notes, openNotesDashboard }) => {
  return (
    <div className="book-card">
      <img
        src={imageUrl}
        alt={title}
        className="book-card__image"
      />
      <div className="book-card__details">
        <label className="book-card__label">Title:</label>
        <h3 className="book-card__title">{title}</h3>
        <label className="book-card__label">Author:</label>
        <p className="book-card__author">{author}</p>
        <label className="book-card__label">Description:</label>
        <p className="book-card__description">{description}</p>
        <label className="book-card__label">Notes:</label>
        <div className="book-card__notes-icon">
          <span role="img" aria-label="notes">📝</span>
        </div>
        {notes && notes.length > 0 && (
          <a href="#" className="book-card__notes-link" onClick={openNotesDashboard}>
            <ul className="book-card__notes">
              {notes.map((note, index) => (
                <li key={index}>
                  <strong>{note.reviewer}:</strong> {note.comment} (Rating: {note.rating})
                </li>
              ))}
            </ul>
          </a>
        )}
      </div>
    </div>
  );
};

export default BookCard;
