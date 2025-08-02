import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaShoppingBag,
  FaCreditCard,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaStore,
  FaCheckCircle
} from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Cart.css';
import { orderAPI, cartAPI } from '../services/api';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await cartAPI.getCart();
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Cart management functions
  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeCartItem(itemId);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    try {
      await cartAPI.updateCartItem(itemId, newQuantity);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update quantity');
    }
  };

  // Group cart items by shop
  const cartByShop = cart.items.reduce((acc, item) => {
    const shopId = item.plant?.shop?._id || 'unknown';
    const shopName = item.plant?.shop?.shopName || 'Unknown Shop';

    if (!acc[shopId]) {
      acc[shopId] = {
        shopName: shopName,
        items: [],
        subtotal: 0
      };
    }
    acc[shopId].items.push(item);
    acc[shopId].subtotal += item.price * item.quantity;
    return acc;
  }, {});

  // Calculate delivery charges (example: free for orders above 500, else 50)
  const calculateDeliveryCharge = (subtotal) => {
    return subtotal > 500 ? 0 : 50;
  };

  // Calculate total for each shop including delivery
  const calculateShopTotal = (subtotal) => {
    const delivery = calculateDeliveryCharge(subtotal);
    return subtotal + delivery;
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }
    
    setIsCheckingOut(true);
    try {
      // First, refresh the cart to ensure we have the latest data
      const cartResponse = await cartAPI.getCart();
      const currentCart = cartResponse.data;
      
      if (!currentCart.items || currentCart.items.length === 0) {
        throw new Error('Your cart is empty');
      }
      
      // Log cart contents for debugging
      console.log('Cart items before order:', currentCart.items);
      
      const orderData = {
        shippingAddress: shippingAddress.trim(),
        paymentMethod: 'Cash on Delivery'
      };
      
      console.log('Sending order data:', orderData);
      
      const response = await orderAPI.createOrder(orderData);
      console.log('Order response:', response);
      
      toast.success('Order placed successfully!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      setShippingAddress('');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      
      // Log the complete error response
      console.error('Complete error response:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
        request: error.request,
        config: error.config,
        stack: error.stack
      });
      
      // Extract error message from different possible locations in the response
      let errorMessage = 'Failed to place order';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { data } = error.response;
        
        if (data && typeof data === 'object') {
          errorMessage = data.message || data.error || JSON.stringify(data);
        } else if (data) {
          errorMessage = String(data);
        } else {
          errorMessage = `Server responded with status ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
        errorMessage = `Request error: ${error.message}`;
      }
      
      // Show the error message to the user
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <FaShoppingBag className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any plants to your cart yet.</p>
          <Link to="/shops" className="btn btn-primary">
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="cart-hero">
        <div className="cart-hero-content">
          <FaShoppingBag className="cart-hero-icon" />
          <h1>Your Cart <span className="cart-count">({cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'})</span></h1>
          <p className="cart-hero-sub">All your green picks in one place!</p>
          <Link to="/shops" className="btn btn-outline cart-hero-btn">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>
      </div>

      {cart.totalAmount < 500 && (
        <div className="cart-offer">
          <span>🌱 Free Delivery on orders above ₹500!</span>
          <div className="cart-offer-progress">
            <div className="cart-offer-bar" style={{ width: `${Math.min((cart.totalAmount / 500) * 100, 100)}%` }}></div>
          </div>
          <span className="cart-offer-amount">₹{(500 - cart.totalAmount).toLocaleString()} away from free delivery</span>
        </div>
      )}

      <div className="cart-content">
        <div className="cart-items">
          {Object.entries(cartByShop).map(([shopId, shopData]) => (
            <div key={shopId} className="cart-shop-card">
              <div className="cart-shop-header">
                <FaStore className="cart-shop-icon" />
                <h2>{shopData.shopName}</h2>
              </div>
              {shopData.items.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img src={item.plant?.image || '/placeholder-plant.jpg'} alt={item.plant?.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.plant?.name}</h3>
                    <div className="item-category">{item.plant?.category || 'Indoor Plant'}</div>
                    <div className="item-price">₹{item.price.toLocaleString()}</div>
                    <div className="item-quantity">
                      <button className="quantity-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}><FaMinus /></button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}><FaPlus /></button>
                      {item.quantity <= 3 && <span className="low-stock-badge">Low Stock</span>}
                      <button className="btn danger remove-btn" onClick={() => removeFromCart(item._id)}><FaTrash /> Remove</button>
                    </div>
                  </div>
                  <div className="item-total">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
              <div className="cart-shop-summary">
                <div>Subtotal ({shopData.items.length} items): <b>₹{shopData.subtotal.toLocaleString()}</b></div>
                <div>Delivery: {calculateDeliveryCharge(shopData.subtotal) === 0 ? <span className="free-delivery">Free</span> : `₹${calculateDeliveryCharge(shopData.subtotal).toLocaleString()}`}</div>
                <div>Total: <span className="shop-total">₹{calculateShopTotal(shopData.subtotal).toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="shipping-address">
            <h3><FaMapMarkerAlt /> Delivery Address</h3>
            <textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Enter your full shipping address" rows="3" required />
          </div>
          <div className="summary-row"><span>Subtotal</span><span>₹{cart.totalAmount.toLocaleString()}</span></div>
          <div className="summary-row"><span>Delivery</span><span>{cart.totalAmount > 500 ? 'Free' : '₹50'}</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{cart.totalAmount > 500 ? cart.totalAmount.toLocaleString() : (cart.totalAmount + 50).toLocaleString()}</span></div>
          <button onClick={handleCheckout} disabled={isCheckingOut || !shippingAddress.trim()} className="btn place-order-btn">
            {isCheckingOut ? <span className="loading">Processing...</span> : 'Place Order'}
          </button>
          <p className="secure-checkout"><FaCheckCircle /> Secure Checkout</p>
        </div>
      </div>

      <footer className="cart-footer">
        <div>© {new Date().getFullYear()} VirtualGreen. All rights reserved.</div>
        <div>
          <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">Instagram</a> |
          <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
