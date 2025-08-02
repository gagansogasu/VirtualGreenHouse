import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        setLoading(true);
        const response = await orderAPI.getOrders();
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        setLoading(true);
        await orderAPI.cancelOrder(orderId);
        
        // Refresh orders list
        const response = await orderAPI.getOrders();
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error cancelling order:', err);
        setError(err.response?.data?.message || 'Failed to cancel order');
      } finally {
        setLoading(false);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f57c00';
      case 'Processing': return '#2196f3';
      case 'Shipped': return '#9c27b0';
      case 'Delivered': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <div className="orders-page">
      <header className="orders-header">
        <div className="logo">VirtualGreen</div>
        <nav className="orders-nav">
          <Link to="/user-dashboard">Home</Link>
          <Link to="/shops">Shops</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      <div className="orders-container">
        <h1>My Orders</h1>

        {loading && <div className="loading">Loading orders...</div>}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="empty-orders">
            <div className="empty-orders-icon">ud83dudce6</div>
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet.</p>
            <Link to="/shops" className="shop-now-btn">
              Shop Now
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.substring(order._id.length - 8)}</h3>
                    <p className="order-date">Placed on {formatDate(order.orderDate)}</p>
                  </div>
                  <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                    {order.status}
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item._id} className="order-item">
                      <div className="item-image">
                        <img 
                          src={item.plant.imageUrl || '/assets/plant-placeholder.jpg'} 
                          alt={item.plant.name} 
                        />
                      </div>
                      <div className="item-details">
                        <h4>{item.plant.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p className="item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-info">
                    <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                    <p><strong>Payment:</strong> {order.paymentMethod}</p>
                    <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                  </div>
                  <div className="order-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      View Details
                    </button>
                    {order.status === 'Pending' && (
                      <button 
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="orders-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>VirtualGreen</h4>
            <p>Your virtual greenhouse experience</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <Link to="/shipping">Shipping</Link>
            <Link to="/returns">Returns</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} VirtualGreen. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Orders;
