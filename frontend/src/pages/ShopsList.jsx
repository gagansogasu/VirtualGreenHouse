import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ShopsList.css';
import { shopAPI } from '../services/api';

const ShopsList = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await shopAPI.getAllShops();
        setShops(res.data);
      } catch (err) {
        setShops([]);
      }
    };
    fetchShops();
  }, []);

  return (
    <div className="shops-list-page">
      <header className="header">
        <div className="logo">VirtualGreen</div>
        <nav className="nav-links">
          <Link to="/user-dashboard">Home</Link>
          <Link to="/shops" className="active">Shops</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <button className="logout-btn" onClick={() => navigate('/login')}>Logout</button>
      </header>

      <main className="shops-list-content">
        <div className="shops-banner">
          <h1>Explore Our Partner Shops</h1>
          <p>Discover unique plants and gardening supplies from our curated collection of specialized plant shops</p>
        </div>

        <section className="featured-shops">
          <h2>Our Partner Nurseries</h2>
          <div className="shops-grid">
            {shops.map(shop => (
              <div key={shop._id} className="shop-card">
                <div className="shop-image">
                  <img src={shop.image} alt={shop.shopName} loading="lazy" />
                </div>
                <div className="shop-info">
                  <h3>{shop.shopName}</h3>
                  <p className="shop-description">{shop.description}</p>
                  <div className="shop-details">
                    <p className="shop-address">{shop.address}</p>
                    <p className="shop-phone">Phone: {shop.phone}</p>
                  </div>
                  <button
                    className="visit-shop-btn"
                    onClick={() => navigate(`/nursery/${shop._id}`)}
                  >
                    Visit Nursery
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
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
            <Link to="/shipping">Shipping Info</Link>
            <Link to="/returns">Returns</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">Twitter</a>
            </div>
          </div>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} VirtualGreen. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ShopsList;
