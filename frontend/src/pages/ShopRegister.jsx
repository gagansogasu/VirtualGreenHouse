import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ShopRegister.css';

const ShopRegister = () => {
    const [formData, setFormData] = useState({
        shopName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        description: '',
        terms: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.shopName.trim()) {
            newErrors.shopName = 'Shop name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be at least 10 digits';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.terms) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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

        setIsLoading(true);
        setErrors({});

        try {
            // Prepare data for API
            const shopData = {
                shopName: formData.shopName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address,
                description: formData.description
            };

            // Send registration request to backend
            const response = await fetch('http://localhost:5000/api/shops/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shopData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.fields) {
                    // Handle field-specific errors
                    setErrors(data.fields);
                } else if (data.errors) {
                    // Handle validation errors
                    setErrors({ submit: data.errors.join(', ') });
                } else {
                    throw new Error(data.message || 'Registration failed');
                }
                return;
            }

            // Store token and shop info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.shop));
            localStorage.setItem('userType', 'shop');

            setSuccess('Registration successful! Redirecting to dashboard...');

            // Redirect after a short delay
            setTimeout(() => {
                navigate('/shop-dashboard');
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ submit: error.message || 'Registration failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="center-section">
                    <img src="/assets/shop_register.png" alt="Shop Registration" className="register-image" />
                </div>

                <div className="right-section">
                    <div className="register-header">
                        <h1>Create your Shop Account</h1>
                        <p>Join Virtual Greenhouse as a shop owner</p>
                    </div>

                    <div className="tabs">
                        <Link to="/register/user" className="tab">Register as User</Link>
                        <button className="tab active">Register as Shop</button>
                    </div>

                    {success && <div className="success-message">{success}</div>}
                    {errors.submit && <div className="error-message">{errors.submit}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="shopName"
                                placeholder="Enter shop name"
                                value={formData.shopName}
                                onChange={handleChange}
                                className={errors.shopName ? 'error' : ''}
                                required
                            />
                            {errors.shopName && <span className="error-message">{errors.shopName}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                                required
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                                required
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'error' : ''}
                                required
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter contact number"
                                value={formData.phone}
                                onChange={handleChange}
                                className={errors.phone ? 'error' : ''}
                                required
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter shop address"
                                value={formData.address}
                                onChange={handleChange}
                                className={errors.address ? 'error' : ''}
                                required
                            />
                            {errors.address && <span className="error-message">{errors.address}</span>}
                        </div>

                        <div className="form-group">
                            <textarea
                                name="description"
                                placeholder="Enter shop description"
                                value={formData.description}
                                onChange={handleChange}
                                className={errors.description ? 'error' : ''}
                                required
                            />
                            {errors.description && <span className="error-message">{errors.description}</span>}
                        </div>

                        <div className="form-group terms">
                            <label>
                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    className={errors.terms ? 'error' : ''}
                                />
                                I agree to the Terms and Conditions
                            </label>
                            {errors.terms && <span className="error-message">{errors.terms}</span>}
                        </div>

                        <button
                            type="submit"
                            className="register-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Create Shop Account'}
                        </button>
                    </form>

                    <p className="login-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShopRegister;