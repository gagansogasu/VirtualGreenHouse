import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';
import '../styles/Checkout.css';

const Checkout = () => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'Cash on Delivery'
  });
  const navigate = useNavigate();

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await cartAPI.getCart();
      setCart(response.data);

      // Pre-fill shipping address from user data if available
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.address) {
        setFormData(prev => ({
          ...prev,
          shippingAddress: userData.address
        }));
      }

    } catch (err) {
      console.error('Error fetching cart:', err);
      // ProtectedRoute handles 401, so no need to navigate here
      // if (err.response?.status === 401) {
      //   navigate('/login');
      // } else {
      setError('Failed to load your cart. Please try again.');
      // }
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies as navigate is not used for auth check

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.shippingAddress.trim()) {
      setError('Please enter a shipping address.');
      return;
    }

    if (!formData.paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await orderAPI.createOrder(formData);
      setOrderId(response.data._id);
      setOrderPlaced(true);
      setCart({ items: [], totalAmount: 0 }); // Clear cart after placing order
      // Optionally clear cart on backend here as well if needed

    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData]); // Depend on formData

  // Memoized cart items rendering
  const renderCartItems = useMemo(() => {
    return cart.items.length === 0 ? (
      <p className="empty-cart-message">Your cart is empty</p>
    ) : (
      <>
        <div className="summary-items">
          {cart.items.map((item) => (
            <div key={item._id} className="summary-item">
              <div className="item-image">
                <img
                  src={item.plant?.imageUrl || '/assets/plant-placeholder.jpg'}
                  alt={item.plant?.name}
                  loading="lazy"
                />
              </div>
              <div className="item-details">
                <h3>{item.plant?.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p className="item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="price-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cart.totalAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span> {/* Assuming free shipping for now */}
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${cart.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </>
    );
  }, [cart.items, cart.totalAmount]); // Depend on cart data

  // Render order success
  const renderOrderSuccess = () => (
    <div className="order-success">
      <div className="success-icon">✓</div>
      <h2>Order Placed Successfully!</h2>
      <p>Your order has been placed successfully. Thank you for shopping with us!</p>
      {orderId && <p className="order-id">Order ID: {orderId}</p>}
      <div className="success-buttons">
        <button onClick={() => navigate('/user-dashboard')} className="home-btn">
          Return to Home
        </button>
        <button onClick={() => navigate('/orders')} className="view-orders-btn">
          View My Orders
        </button>
      </div>
    </div>
  );

  // Render checkout form
  const renderCheckoutForm = () => (
    <div className="checkout-content">
      <div className="checkout-summary">
        <h2>Order Summary</h2>
        {renderCartItems}
      </div>

      <div className="checkout-form-container">
        <h2>Shipping & Payment</h2>
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="shippingAddress">Shipping Address</label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              placeholder="Enter your full shipping address"
              required
              rows="4"
            />
            {error && formData.shippingAddress.trim() === '' && <p className="error-message">{error}</p>}
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="Credit Card"
                  checked={formData.paymentMethod === 'Credit Card'}
                  onChange={handleInputChange}
                />
                <label htmlFor="creditCard">Credit Card</label>
              </div>

              <div className="payment-method">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="PayPal"
                  checked={formData.paymentMethod === 'PayPal'}
                  onChange={handleInputChange}
                />
                <label htmlFor="paypal">PayPal</label>
              </div>

              <div className="payment-method">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === 'Cash on Delivery'}
                  onChange={handleInputChange}
                />
                <label htmlFor="cod">Cash on Delivery</label>
              </div>
            </div>
            {error && !formData.paymentMethod && <p className="error-message">{error}</p>}
          </div>

          <div className="checkout-actions">
            <Link to="/cart" className="back-to-cart">
              Back to Cart
            </Link>
            <button
              type="submit"
              className="place-order-btn"
              disabled={loading || cart.items.length === 0 || !formData.shippingAddress.trim() || !formData.paymentMethod}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        {/* Consider adding actual site logo/nav here */}
        <Link to="/user-dashboard" className="logo">VirtualGreen</Link>
        <nav className="checkout-nav">
          <Link to="/user-dashboard">Home</Link>
          <Link to="/shops">Shops</Link>
          <Link to="/cart">Cart</Link>
        </nav>
      </header>

      <div className="checkout-container">
        <h1>{orderPlaced ? 'Order Confirmation' : 'Checkout'}</h1>

        {/* Use loading spinner component */}
        {loading && !orderPlaced && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading checkout...</p>
          </div>
        )}

        {/* Display general errors, specific form errors handled inline */}
        {error && !(!formData.shippingAddress.trim() || !formData.paymentMethod) && (
          <div className="error-message general">{error}</div>
        )}

        {!loading && orderPlaced && renderOrderSuccess()}

        {!loading && !orderPlaced && renderCheckoutForm()}

        {/* Handle empty cart state when not loading and not order placed */}
        {!loading && !orderPlaced && cart.items.length === 0 && (
          <div className="empty-cart-container">
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shops" className="shop-now-link">Shop Now</Link>
          </div>
        )}

      </div>

      <footer className="checkout-footer">
        {/* Footer content - consider creating a reusable Footer component */}
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>VirtualGreen is your online destination for plants.</p>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: info@virtualgreen.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            {/* Add social media links */}
          </div>
        </div>
        <p className="footer-bottom-text">© 2023 VirtualGreen. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Checkout;

