import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaLeaf, FaSeedling, FaTree, FaChevronLeft } from 'react-icons/fa';
import '../styles/NurseryDetails.css';
import { useCart } from '../contexts/CartContext';
import { shopAPI, plantAPI } from '../services/api';

// Helper function to slugify plant names
const slugify = (name) => name.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');

const NurseryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nursery, setNursery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plants');
  const { addToCart } = useCart();
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const fetchNurseryDetails = async () => {
      try {
        setLoading(true);
        // Fetch shop/nursery details from backend
        const response = await shopAPI.getShopById(id);
        setNursery(response.data);
        // Fetch plants for this shop
        const plantsRes = await plantAPI.getPlantsByShop(response.data._id);
        setPlants(plantsRes.data);
      } catch (error) {
        console.error('Error fetching nursery details:', error);
        navigate('/shops');
      } finally {
        setLoading(false);
      }
    };
    fetchNurseryDetails();
  }, [id, navigate]);

  const handleAddToCart = (plant) => {
    if (!plant._id) {
      alert('This plant cannot be added to cart (missing database ID).');
      return;
    }
    addToCart({
      id: plant._id,
      name: plant.name,
      price: plant.price,
      image: plant.image,
      shopId: nursery._id,
      shopName: nursery.shopName
    }, 1);
  };

  if (loading || !nursery) {
    return <div>Loading...</div>;
  }

  return (
    <div className="nursery-details">
      {/* Header with Back Button */}
      <header className="nursery-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaChevronLeft /> Back
        </button>
        <h1>{nursery.shopName}</h1>
      </header>

      {/* Hero Section */}
      <section className="nursery-hero">
        <div className="nursery-image">
          <img src={nursery.image} alt={nursery.shopName} />
        </div>
        <div className="nursery-info">
          <h2>Welcome to {nursery.shopName}</h2>
          <p className="nursery-description">{nursery.description}</p>

          <div className="contact-info">
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>{nursery.address}</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <a href={`tel:${nursery.phone.replace(/\D/g, '')}`}>
                {nursery.phone}
              </a>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href={`mailto:${nursery.email}`}>
                {nursery.email}
              </a>
            </div>
          </div>

          <button className="virtual-tour-btn" onClick={() => {
            // Slugify the nursery name for folder path
            const folder = nursery.shopName.replace(/ /g, '_').replace(/[^a-zA-Z0-9_]/g, '');
            const url = `/Virtual/${folder}/app-files/index.html`;
            window.open(url, '_blank');
          }}>
            <FaSeedling /> Take a Virtual Tour
          </button>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'plants' ? 'active' : ''}`}
          onClick={() => setActiveTab('plants')}
        >
          <FaLeaf /> Plant Collection
        </button>
        <button
          className={`tab ${activeTab === 'virtual' ? 'active' : ''}`}
          onClick={() => setActiveTab('virtual')}
        >
          <FaTree /> Virtual Tour
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'plants' ? (
          <div className="plants-grid">
            {plants && plants.length > 0 ? plants.map(plant => (
              <div key={plant._id} className="plant-card">
                <div className="plant-image">
                  <img src={plant.image} alt={plant.name} />
                </div>
                <div className="plant-details">
                  <h3>{plant.name}</h3>
                  <p className="plant-category">{plant.category}</p>
                  <p className="plant-description">{plant.description}</p>
                  <div className="plant-footer">
                    <span className="plant-price">₹{plant.price.toLocaleString()}</span>
                    <div className="plant-actions">
                      <button
                        className="view-3d-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const glbPath = `/Plant3D/${slugify(plant.name)}.glb`;
                          const viewerPath = `/Plant3D/viewer.html?model=${encodeURIComponent(glbPath)}`;
                          window.open(viewerPath, '_blank');
                        }}
                      >
                        View 3D
                      </button>
                      <button className="add-to-cart" onClick={() => handleAddToCart(plant)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            )) : <div>No plants available.</div>}
          </div>
        ) : (
          <div className="virtual-tour">
            <h3>Virtual Tour of {nursery.shopName}</h3>
            <div className="video-container">
              <iframe
                width="100%"
                height="500"
                src={nursery.virtualTour}
                title={`Virtual Tour of ${nursery.shopName}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="tour-description">
              Take a virtual walkthrough of our nursery and explore our wide variety of plants and gardening supplies.
              Our knowledgeable staff is always available to assist you with your gardening needs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseryDetails;
