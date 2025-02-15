import React, { useState } from 'react';
import './AddBookForm.css';

const AddBookForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        imageURL: ''
    });

    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ type: '', message: '' });

    const validateForm = () => {
        const newErrors = {};
        
        // Title validation (at least 3 characters)
        if (!formData.title) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters long';
        }

        // Description validation (at least 20 characters)
        if (!formData.description) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 20) {
            newErrors.description = 'Description must be at least 20 characters long';
        }

        // Author validation (text only)
        if (!formData.author) {
            newErrors.author = 'Author is required';
        } else if (!/^[a-zA-Z\s.]+$/.test(formData.author)) {
            newErrors.author = 'Author name should contain only letters, spaces, and periods';
        }

        // Image URL validation (optional)
        if (formData.imageURL && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.imageURL)) {
            newErrors.imageURL = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setNotification({
                type: 'error',
                message: 'Please correct the errors in the form'
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to save book');
            }

            const data = await response.json();
            
            setNotification({
                type: 'success',
                message: `Book "${formData.title}" has been successfully added!`
            });

            // Clear form
            setFormData({
                title: '',
                description: '',
                author: '',
                imageURL: ''
            });

        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Failed to save book. Please try again.'
            });
        }
    };

    const isFormValid = () => {
        return formData.title && formData.description && formData.author && Object.keys(errors).length === 0;
    };

    return (
        <div className="add-book-form-container">
            <h2>Add New Book</h2>
            
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="add-book-form">
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={errors.title ? 'error' : ''}
                        required
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={errors.description ? 'error' : ''}
                        required
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author *</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className={errors.author ? 'error' : ''}
                        required
                    />
                    {errors.author && <span className="error-message">{errors.author}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="imageURL">Image URL</label>
                    <input
                        type="url"
                        id="imageURL"
                        name="imageURL"
                        value={formData.imageURL}
                        onChange={handleChange}
                        className={errors.imageURL ? 'error' : ''}
                    />
                    {errors.imageURL && <span className="error-message">{errors.imageURL}</span>}
                </div>

                <button 
                    type="submit" 
                    disabled={!isFormValid()}
                    className="submit-button"
                >
                    Add Book
                </button>
            </form>
        </div>
    );
};

export default AddBookForm;
