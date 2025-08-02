import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI, orderAPI } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userResponse = await userAPI.getProfile();
      setUserData(userResponse.data);
      setFormData({
        name: userResponse.data.name || '',
        email: userResponse.data.email || '',
        phone: userResponse.data.phone || '',
        address: userResponse.data.address || ''
      });

      try {
        const ordersResponse = await orderAPI.getOrders();
        setOrders(ordersResponse.data);
      } catch (orderError) {
        console.error('Error fetching orders:', orderError);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await userAPI.updateProfile(formData);
      setUserData(response.data);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'An error occurred while updating your profile');
      alert(error.response?.data?.message || 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  }, []);

  const handleToggleEditMode = useCallback(() => {
    setEditMode(prevMode => !prevMode);
    if (editMode && userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    }
  }, [editMode, userData]);

  if (loading && !userData) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="error-container">
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <button onClick={fetchUserData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!loading && !userData) {
    return (
      <div className="error-container">
        <h2>Profile Not Found</h2>
        <p>Could not load your profile information.</p>
        <Link to="/user-dashboard" className="retry-button">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/user-dashboard" className="logo">VirtualGreen</Link>
        <nav className="profile-nav">
          <Link to="/user-dashboard">Home</Link>
          <Link to="/shops">Shops</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile" className="active">Profile</Link>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img src={userData?.avatarUrl || "/assets/default-avatar.jpg"} alt="Profile" />
            <h2>{userData?.name || 'User'}</h2>
            <p>{userData?.email}</p>
          </div>
          <ul className="profile-menu">
            <li className="active">Profile Information</li>
            <li><Link to="/orders">Order History</Link></li>
          </ul>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <h2>Profile Information</h2>
              <button
                className="edit-btn"
                onClick={handleToggleEditMode}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editMode ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                {error && !loading && <p className="error-message">{error}</p>}
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-group">
                  <span className="info-label">Full Name:</span>
                  <span className="info-value">{userData?.name || 'Not provided'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{userData?.email || 'Not provided'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{userData?.phone || 'Not provided'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{userData?.address || 'Not provided'}</span>
                </div>
                <div className="info-group">
                  <span className="info-label">Member Since:</span>
                  <span className="info-value">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="profile-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/orders" className="view-all-link">View All</Link>
            </div>
            <div className="orders-list">
              {loading && <p>Loading orders...</p>}
              {!loading && error && <p className="error-message">{error}</p>}
              {!loading && orders.length === 0 && !error && <p>You have no recent orders.</p>}
              {orders.length > 0 && (
                <div className="orders-list">
                  {orders.slice(0, 3).map(order => (
                    <div className="order-card" key={order._id}>
                      <div className="order-header">
                        <Link to={`/orders/${order._id}`} className="order-id">Order #{order._id.substring(0, 8)}</Link>
                        <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                        <span className={`order-status ${order.status.toLowerCase().replace(/ /g, '-')}`}>{order.status}</span>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <img src={item.plant?.imageUrl || item.image || '/assets/plant-placeholder.jpg'} alt={item.plant?.name || item.name} />
                            <div className="item-details">
                              <span className="item-name">{item.plant?.name || item.name}</span>
                              <span className="item-price">₹{(item.price * item.quantity).toFixed(2)} x {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="order-footer">
                        <span className="order-total">Total: ₹{(order.totalAmount || 0).toFixed(2)}</span>
                        <Link to={`/orders/${order._id}`} className="view-order-details">View Details</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;