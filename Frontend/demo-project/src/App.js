import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
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

  return (
    <div className="App">
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
