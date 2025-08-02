import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import '../styles/UserDashboard.css';

// Constants
const SLIDE_INTERVAL = 10000;
const DRAG_THRESHOLD = 50;

const UserDashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userData, setUserData] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const slideIntervalRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef(0);
  // Removed useNavigate as navigation is now handled by ProtectedRoute
  // const navigate = useNavigate();

  // Memoized slides data
  const slides = useMemo(() => [
    {
      image: '/assets/dashboard_1.jpg',
      title: 'Welcome to VirtualGreen',
      description: 'Your ultimate destination for beautiful indoor and outdoor plants',
      buttonText: 'Shop Now',
      link: '/shops'
    },
    {
      image: '/assets/dashboard_2.jpg',
      title: 'Explore Exotic Plant Collections',
      description: 'Discover rare and unique plants from around the world',
      buttonText: 'Explore Collections',
      link: '/plants'
    },
    {
      image: '/assets/dashboard_3.jpg',
      title: 'Sustainable Gardening',
      description: 'All our plants are grown using eco-friendly practices',
      buttonText: 'Learn More',
      link: '/about'
    }
  ], []);

  // Memoized plant categories
  const plantCategories = useMemo(() => [
    {
      name: 'Indoor Plants',
      description: 'Perfect plants for improving air quality and adding life to your home.',
      count: 45,
      image: '/assets/indoor-plants.jpg',
      link: '/plants/indoor'
    },
    {
      name: 'Succulents & Cacti',
      description: 'Low-maintenance plants perfect for beginners and busy people.',
      count: 38,
      image: '/assets/succulents.jpg',
      link: '/plants/succulents'
    },
    {
      name: 'Flowering Plants',
      description: 'Colorful blooms to brighten up any space in your home or garden.',
      count: 27,
      image: '/assets/flowering.jpg',
      link: '/plants/flowering'
    }
  ], []);

  // Fetch user data and shops
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      // Fetch user profile
      const userResponse = await userAPI.getProfile();
      setUserData(userResponse.data);

      // Use hardcoded shops data for now
      const featuredShops = [
        {
          _id: '1',
          shopName: 'Nandanam Nursery',
          description: 'One of the oldest and most trusted nurseries in Hassan, offering a wide variety of plants, seeds, and gardening accessories.',
          address: 'Rangoli Halla, Hassan, Karnataka 573201',
          phone: '+91 44 2434 4455',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
        },
        {
          _id: '2',
          shopName: 'The Nurserymen Co-operative Society Ltd',
          description: 'A cooperative society of nurserymen providing quality plants, gardening tools, and expert advice to gardening enthusiasts.',
          address: 'Krishnaraja Pura, Hassan, Karnataka 573201',
          phone: '+91 44 2819 0417',
          image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1753&q=80'
        }
      ];

      setShops(featuredShops);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      // Handle 401 by ProtectedRoute, no need to navigate here
      // if (error.response?.status === 401) {
      //   localStorage.removeItem('token');
      //   localStorage.removeItem('user');
      //   localStorage.removeItem('userType');
      //   navigate('/login');
      // }
    } finally {
      setLoading(false);
    }
  }, []); // Removed navigate from dependencies

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Moved logout to a separate handler or context if needed globally
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    window.location.href = '/login'; // Use direct assignment or context for global logout
  }, []);

  // Slideshow controls
  const startSlideShow = useCallback(() => {
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL);
  }, [slides.length]);

  const resetTimer = useCallback(() => {
    clearInterval(slideIntervalRef.current);
    startSlideShow();
  }, [startSlideShow]);

  const changeSlide = useCallback((n) => {
    setCurrentSlide(n);
    resetTimer();
  }, [resetTimer]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    startPosRef.current = e.clientX;
    clearInterval(slideIntervalRef.current);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const currentPosition = e.clientX;
    const diff = currentPosition - startPosRef.current;

    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff > 0) {
        changeSlide((currentSlide - 1 + slides.length) % slides.length);
      } else {
        changeSlide((currentSlide + 1) % slides.length);
      }
      isDraggingRef.current = false;
    }
  }, [changeSlide, currentSlide, slides.length]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    resetTimer();
  }, [resetTimer]);

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      resetTimer();
    }
  }, [resetTimer]);

  // Start and cleanup slideshow effect
  useEffect(() => {
    startSlideShow();
    return () => clearInterval(slideIntervalRef.current);
  }, [startSlideShow]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <header>
        <nav className="navbar">
          <Link to="/" className="logo">&#127807; VirtualGreen</Link>
          <ul className="nav-links">
            <li><Link to="/user-dashboard" className="active">Home</Link></li>
            <li><Link to="/shops">Shops</Link></li>
          </ul>
          <div className="nav-buttons">
            <div className="user-menu">
              <Link to="/profile" className="profile-link">
                <span className="user-avatar">
                  {userData?.name?.charAt(0) || 'U'}
                </span>
                <span className="user-name">{userData?.name || 'User'}</span>
              </Link>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </nav>
      </header>

      <div
        className="slider-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slider-overlay">
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <Link to={slide.link} className="shop-btn">{slide.buttonText}</Link>
            </div>
          </div>
        ))}

        <div className="slider-nav">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => changeSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="slider-arrows">
          <button
            className="slider-arrow prev"
            onClick={() => changeSlide((currentSlide - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
          >
            &#10094;
          </button>
          <button
            className="slider-arrow next"
            onClick={() => changeSlide((currentSlide + 1) % slides.length)}
            aria-label="Next slide"
          >
            &#10095;
          </button>
        </div>
      </div>

      <section className="featured-shops">
        <h2>Featured Nurseries</h2>
        <div className="shops-grid">
          {shops.map((shop) => (
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
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;