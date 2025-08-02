import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart, FaStar, FaRegStar, FaHeart, FaRegHeart, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/shop_1.css';

const ShopPage = () => {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState({});
  const [favorites, setFavorites] = useState({});
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Initialize quantity state for each plant
  useEffect(() => {
    if (shopData?.plants) {
      const initialQuantities = {};
      shopData.plants.forEach(plant => {
        initialQuantities[plant._id] = 1;
      });
      setQuantity(initialQuantities);
    }
  }, [shopData]);
  
  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  // Toggle favorite status
  const toggleFavorite = (plantId) => {
    const newFavorites = { ...favorites, [plantId]: !favorites[plantId] };
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  // Handle quantity changes
  const handleQuantityChange = (plantId, newQuantity) => {
    const num = parseInt(newQuantity, 10);
    if (!isNaN(num) && num >= 1) {
      setQuantity(prev => ({
        ...prev,
        [plantId]: num
      }));
    }
  };
  
  // Add item to cart
  const handleAddToCart = (plant) => {
    addToCart({
      id: plant._id,
      name: plant.name,
      price: plant.price,
      image: plant.image,
      shopId: shopData._id,
      shopName: shopData.shopName
    }, quantity[plant._id] || 1);
    
    toast.success(`${quantity[plant._id] || 1} ${plant.name} added to cart!`, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/shops/${shopId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shop data');
        }
        const data = await response.json();
        setShopData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchShopData();
    }
  }, [shopId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading shop details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Shop</h3>
        <p>{error}</p>
        <button className="btn green" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="not-found">
        <h3>Shop Not Found</h3>
        <p>The shop you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="btn green">
          Browse Other Shops
        </Link>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <Link to="/">
            <strong>VirtualGreen</strong>
          </Link>
        </div>
        <nav>
          <Link to="/user-dashboard">Home</Link>
          <Link to="/virtual-tour">Virtual Tour</Link>
          <Link to="/3d-viewer">3D Viewer</Link>
          <Link to="/shop" className="active">Shop</Link>
        </nav>
        <div className="header-actions">
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            <span className="cart-count">0</span>
          </Link>
          <button className="btn green" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </header>

      <div className="hero">
        <div className="hero-image" style={{ backgroundImage: `url(${shopData.bannerImage || '/images/greenhouse.jpg'})` }}></div>
        <div className="hero-overlay">
          <div className="shop-rating">
            {[...Array(5)].map((_, i) => (
              i < Math.floor(shopData.rating || 0) ? 
                <FaStar key={i} className="star filled" /> : 
                <FaRegStar key={i} className="star" />
            ))}
            <span>({shopData.reviewCount || 0} reviews)</span>
          </div>
          <h1>{shopData.shopName}</h1>
          <p className="shop-description">{shopData.description}</p>
          <div className="shop-meta">
            {shopData.tags?.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="shop-info">
        <div className="info-card">
          <h3>Shop Information</h3>
          <p><strong>Address:</strong> {shopData.address}</p>
          <p><strong>Phone:</strong> {shopData.phone}</p>
          <p><strong>Email:</strong> {shopData.email}</p>
        </div>
      </section>

      <section className="plant-section">
        <h2 className="section-title">Available Plants</h2>
        <div className="plant-grid">
          {shopData.plants && shopData.plants.length > 0 ? (
            shopData.plants.map((plant) => (
              <div key={plant._id} className="plant-card">
                <div className="plant-image">
                  <img 
                    src={plant.image || '/images/plant-placeholder.jpg'} 
                    alt={plant.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/plant-placeholder.jpg';
                    }}
                  />
                  <button 
                    className={`favorite-btn ${favorites[plant._id] ? 'active' : ''}`}
                    onClick={() => toggleFavorite(plant._id)}
                    aria-label={favorites[plant._id] ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites[plant._id] ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
                <div className="plant-info">
                  <h3>{plant.name}</h3>
                  <p className="plant-description">{plant.description}</p>
                  <div className="plant-price">
                    <span className="price">${plant.price.toFixed(2)}</span>
                    {plant.originalPrice && (
                      <span className="original-price">${plant.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="quantity-selector">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(plant._id, (quantity[plant._id] || 1) - 1)}
                      disabled={(quantity[plant._id] || 1) <= 1}
                    >
                      <FaMinus />
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={quantity[plant._id] || 1} 
                      onChange={(e) => handleQuantityChange(plant._id, e.target.value)}
                      className="quantity-input"
                    />
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(plant._id, (quantity[plant._id] || 1) + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(plant)}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-plants">
              <p>No plants available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      {shopData.featuredPlants && shopData.featuredPlants.length > 0 && (
        <section className="featured">
          <h2 className="section-title">Featured Plants</h2>
          <div className="featured-cards">
            {shopData.featuredPlants.map((plant, index) => (
              <PlantCard
                key={index}
                plant={plant}
                onAddToCart={handleAddToCart}
                isFavorite={!!favorites[plant._id]}
                onToggleFavorite={() => toggleFavorite(plant._id)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="cta">
        <h2>Ready to Explore More?</h2>
        <button className="btn green" onClick={() => navigate('/virtual-tour')}>Continue 3D Tour</button>
        <button className="btn orange" onClick={() => navigate('/shop')}>Shop Now</button>
      </section>

      <footer>
        <div>
          <h4>VirtualGreen</h4>
          <p>Shaping the future of plant care</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <p>FAQ<br />Privacy Policy<br />Terms of Use</p>
        </div>
        <div>
          <h4>Support</h4>
          <p>Contact Us<br />Help Center</p>
        </div>
        <div>
          <h4>Follow Us</h4>
          <p>Instagram | Facebook | Twitter</p>
        </div>
      </footer>
    </div>
  );
};

const PlantCard = ({ plant, onAddToCart, isFavorite, onToggleFavorite }) => {
  const [quantity, setQuantity] = useState(1);
  
  const handleQuantityChange = (newQuantity) => {
    const num = parseInt(newQuantity, 10);
    if (!isNaN(num) && num >= 1) {
      setQuantity(num);
    }
  };
  
  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(plant, quantity);
  };
  
  return (
    <div className="featured-plant-card">
      <div className="featured-plant-image">
        <img 
          src={plant.image || '/images/plant-placeholder.jpg'} 
          alt={plant.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/plant-placeholder.jpg';
          }}
        />
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
      <div className="featured-plant-info">
        <h3>{plant.name}</h3>
        <p className="plant-desc">{plant.description}</p>
        <div className="plant-price">
          <span className="price">${plant.price.toFixed(2)}</span>
          {plant.originalPrice && (
            <span className="original-price">${plant.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <div className="quantity-selector">
          <button 
            className="quantity-btn" 
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <FaMinus />
          </button>
          <input 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="quantity-input"
          />
          <button 
            className="quantity-btn"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <FaPlus />
          </button>
        </div>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCartClick}
        >
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ShopPage;
