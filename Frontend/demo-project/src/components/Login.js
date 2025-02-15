import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate empty fields
    if (!formData.name || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);

        // Redirect based on role
        if (data.role === 'Admin') {
          window.location.href = '/admin-dashboard';
        } else {
          window.location.href = '/user-dashboard';
        }
      } else {
        setError('Invalid name or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Check for session expiry
  React.useEffect(() => {
    const sessionExpired = new URLSearchParams(window.location.search).get('sessionExpired');
    if (sessionExpired === 'true') {
      setIsSessionExpired(true);
      setError('Your session has expired. Please log in again.');
    }
  }, []);

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        
        {isSessionExpired && (
          <div className="session-expired-message">
            Session expired. Please log in again.
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
