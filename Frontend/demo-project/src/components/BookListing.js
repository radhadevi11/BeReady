import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import './BookListing.css';

const BookListing = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`http://localhost:3001/books`);
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const result = await response.json();
        const data = result.data
        console.log(data.length);
        setBooks(data);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredBooks = books.filter(book => {
    const title = book.title || '';
    const author = book.author || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           author.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="book-listing-container">
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
    <div className="book-listing">
      {Array.isArray(filteredBooks) && filteredBooks.map((book, index) => (
        <BookCard
          key={index}
          title={book.title}
          author={book.author}
          description={book.description}
          imageUrl={book.imageUrl}
          notes={book.notes}
        />
      ))}
    </div>
    </div>
  );
};

export default BookListing;
