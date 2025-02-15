import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    role: 'User'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation (alphabetical characters only)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only alphabetical characters';
    }

    // Password validation (minimum 6 characters)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message and redirect to login
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        if (data.error === 'duplicate_name') {
          setErrors(prev => ({
            ...prev,
            name: 'This name is already taken'
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            general: 'Registration failed. Please try again.'
          }));
        }
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'An error occurred. Please try again.'
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.password.length >= 6 && 
           /^[a-zA-Z\s]+$/.test(formData.name);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Register</h2>
        
        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
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
              className={errors.password ? 'error' : ''}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="role-select"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={!isFormValid()}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
