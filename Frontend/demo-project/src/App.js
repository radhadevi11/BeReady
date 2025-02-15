import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import RegistrationForm from './components/RegistrationForm';
import AddBookForm from './components/AddBookForm';

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

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <div>
                <h2>Admin Dashboard</h2>
                <Link to="/add-book">
                  <button style={{ padding: '10px 20px', margin: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Add New Book
                  </button>
                </Link>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-book"
          element={
            <ProtectedRoute>
              <AddBookForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <div>User Dashboard</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
