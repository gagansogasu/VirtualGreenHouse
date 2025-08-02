import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [activeTab, setActiveTab] = useState('user');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const endpoint = activeTab === 'user' ? '/api/users/login' : '/api/shops/login';
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token and user info in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user || data.shop));
            localStorage.setItem('userType', activeTab);

            // Redirect based on user type
            if (activeTab === 'user') {
                navigate('/user-dashboard');
            } else {
                navigate('/shop-dashboard');
            }
        } catch (err) {
            setErrors({ submit: err.message || 'Login failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="login-card">
                <div className="form-section">
                    <div className="logo">🌿 Virtual Greenhouse</div>

                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'user' ? 'active' : ''}`}
                            onClick={() => handleTabClick('user')}
                        >
                            User
                        </button>
                        <button
                            className={`tab ${activeTab === 'shop' ? 'active' : ''}`}
                            onClick={() => handleTabClick('shop')}
                        >
                            Shop
                        </button>
                    </div>

                    {errors.submit && <div className="error-message">{errors.submit}</div>}

                    {/* User Form */}
                    <form id="userForm" className={`login-form ${activeTab === 'user' ? 'active' : ''}`} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={errors.email ? 'error' : ''}
                                required
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={errors.password ? 'error' : ''}
                                required
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <div className="options">
                            <label className="remember">
                                <input type="checkbox" /> Remember me
                            </label>
                            <div className="forgot-password-link">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login as User'}
                        </button>
                    </form>

                    {/* Shop Form */}
                    <form id="shopForm" className={`login-form ${activeTab === 'shop' ? 'active' : ''}`} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="shop-email">Shop Email</label>
                            <input
                                type="email"
                                id="shop-email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your shop email"
                                className={errors.email ? 'error' : ''}
                                required
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="shop-password">Password</label>
                            <input
                                type="password"
                                id="shop-password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={errors.password ? 'error' : ''}
                                required
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <div className="options">
                            <label className="remember">
                                <input type="checkbox" /> Remember me
                            </label>
                            <div className="forgot-password-link">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login as Shop'}
                        </button>
                    </form>

                    <div className="register">
                        Don't have an account? <Link to="/register/user">Register here</Link>
                    </div>
                </div>

                <div className="image-section">
                    <img src="/assets/login.jpg" alt="Greenhouse" />
                </div>
            </div>

            <div className="footer">
                <a href="/terms">Terms of Service</a> • <a href="/privacy">Privacy Policy</a>
            </div>
        </div>
    );
};

export default Login;
