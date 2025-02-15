import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import BookListing from './components/BookListing';
import BookCard from './components/BookCard';
import NotesDashboard from './components/NotesDashboard';
import Login from './components/Login';
import RegistrationForm from './components/RegistrationForm';

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login?sessionExpired=true" />;
    }
    return children;
  };

  const [isNotesDashboardOpen, setNotesDashboardOpen] = useState(false);

  const openNotesDashboard = () => setNotesDashboardOpen(true);
  const closeNotesDashboard = () => setNotesDashboardOpen(false);

  return (
    <div className="App">
      <NotesDashboard isOpen={isNotesDashboardOpen} onClose={closeNotesDashboard} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <div>Admin Dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <div>
                <BookListing />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/book/:title" element={<div>Book Detail Page (Placeholder)</div>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
