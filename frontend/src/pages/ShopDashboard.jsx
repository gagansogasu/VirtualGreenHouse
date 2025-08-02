import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { shopAPI, plantAPI, orderAPI } from '../services/api';
import '../styles/ShopDashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast } from 'react-hot-toast';

const ShopDashboard = () => {
  const [shopData, setShopData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addPlantError, setAddPlantError] = useState(null);
  const [plantFormData, setPlantFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    inStock: true,
    image: null,
    model3d: null
  });
  const [addingPlant, setAddingPlant] = useState(false);
  const navigate = useNavigate();

  const [plants, setPlants] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [shopFormData, setShopFormData] = useState({
    shopName: '',
    phone: '',
    address: '',
    description: ''
  });
  const [updateProfileError, setUpdateProfileError] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Fetch shop data, orders, and plants
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch shop profile
      const shopResponse = await shopAPI.getProfile();
      const shopData = shopResponse.data;
      setShopData(shopData);

      // Initialize shop form data
      setShopFormData({
        shopName: shopData.shopName || '',
        phone: shopData.phone || '',
        address: shopData.address || '',
        description: shopData.description || ''
      });

      // Fetch shop orders
      try {
        const ordersResponse = await orderAPI.getShopOrders();
        setOrders(ordersResponse.data || []);
      } catch (orderError) {
        console.error('Error fetching shop orders:', orderError);
        setOrders([]);
      }

      // Fetch plants
      try {
        const plantsResponse = await plantAPI.getPlants();
        setPlants(plantsResponse.data || []);
      } catch (plantsError) {
        console.error('Error fetching plants:', plantsError);
        setPlants([]);
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
      setError(error.response?.data?.message || 'Failed to fetch shop data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up periodic refresh of orders
  useEffect(() => {
    fetchData();

    // Refresh orders every 30 seconds
    const refreshInterval = setInterval(() => {
      orderAPI.getShopOrders()
        .then(response => {
          setOrders(response.data || []);
        })
        .catch(error => {
          console.error('Error refreshing orders:', error);
        });
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [fetchData]);

  // Add refresh button handler
  const handleRefreshOrders = () => {
    setLoading(true);
    orderAPI.getShopOrders()
      .then(response => {
        setOrders(response.data || []);
        toast.success('Orders refreshed successfully!');
      })
      .catch(error => {
        console.error('Error refreshing orders:', error);
        toast.error('Failed to refresh orders');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  }, []);

  // Handle shop profile form input changes
  const handleShopInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setShopFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handle shop profile update
  const handleUpdateProfile = useCallback(async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setUpdateProfileError(null);

    try {
      const response = await shopAPI.updateProfile(shopFormData);

      if (response.data) {
        setShopData(response.data.shop);
        setEditMode(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateProfileError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  }, [shopFormData]);

  const handlePlantInputChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    setPlantFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
    }));
    if (addPlantError && (name === 'name' || name === 'price')) {
      setAddPlantError(null);
    }
  }, [addPlantError]);

  const handleAddPlantSubmit = useCallback(async (e) => {
    e.preventDefault();
    setAddingPlant(true);
    setAddPlantError(null);

    if (!plantFormData.name.trim() || !plantFormData.price || !plantFormData.category || !plantFormData.description) {
      setAddPlantError('Please fill in all required fields (name, price, category, description).');
      setAddingPlant(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', plantFormData.name);
      formDataToSend.append('category', plantFormData.category);
      formDataToSend.append('description', plantFormData.description);
      formDataToSend.append('price', plantFormData.price);
      formDataToSend.append('inStock', plantFormData.inStock);
      formDataToSend.append('stock', plantFormData.inStock ? 10 : 0); // Default stock value

      if (plantFormData.image) {
        formDataToSend.append('image', plantFormData.image);
      }
      if (plantFormData.model3d) {
        formDataToSend.append('model3d', plantFormData.model3d);
      }

      const response = await plantAPI.addPlant(formDataToSend);

      if (response.data && response.data.success) {
        alert(response.data.message || 'Plant added successfully!');
        setPlantFormData({
          name: '',
          category: '',
          description: '',
          price: '',
          inStock: true,
          image: null,
          model3d: null
        });

        // Refresh plants list
        fetchData();
      } else {
        setAddPlantError(response.data?.message || 'Failed to add plant.');
      }
    } catch (error) {
      console.error('Error adding plant:', error);
      setAddPlantError(error.response?.data?.message || 'An error occurred while adding the plant.');
    } finally {
      setAddingPlant(false);
    }
  }, [plantFormData, fetchData]);

  if (loading && !shopData) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error && !shopData) {
    return (
      <div className="error-container">
        <h2>Error Loading Shop Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!loading && !shopData) {
    return (
      <div className="error-container">
        <h2>Shop Data Not Found</h2>
        <p>Could not load your shop information. Please ensure you are logged in as a shop owner.</p>
        <Link to="/login" className="retry-button">Login Page</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo-container">
          <h2>🌿 Virtual Greenhouse</h2>
          <p className="shop-type">Shop Portal</p>
        </div>
        <div className="shop-info">
          {shopData && (
            <div className="shop-profile">
              <div className="shop-avatar">
                {shopData.shopName?.charAt(0) || 'S'}
              </div>
              <div className="shop-details">
                <h3>{shopData.shopName || 'My Shop'}</h3>
                <p>{shopData.email || 'shop@example.com'}</p>
              </div>
            </div>
          )}
        </div>
        <nav>
          <ul>
            <li className="active"><Link to="/shop-dashboard"><i className="fas fa-home"></i> Dashboard</Link></li>
            <li><Link to="/shop-dashboard/orders"><i className="fas fa-shopping-bag"></i> Orders</Link></li>
            <li><Link to="/shop-dashboard/add-plant"><i className="fas fa-plus-circle"></i> Add New Plant</Link></li>
            <li><Link to="/shop-dashboard/my-plants"><i className="fas fa-leaf"></i> My Plants</Link></li>
            <li><Link to="/shop-dashboard/profile"><i className="fas fa-user"></i> Profile</Link></li>
            <li onClick={handleLogout} className="logout-btn"><i className="fas fa-sign-out-alt"></i> Logout</li>
          </ul>
        </nav>
      </div>

      <div className="main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Shop Dashboard</h1>
          </div>
          <div className="header-right">
            <button
              className="refresh-btn"
              onClick={handleRefreshOrders}
              disabled={loading}
            >
              <i className="fas fa-sync-alt"></i> Refresh Orders
            </button>
            <div className="user-info">
              <span>{shopData?.shopName || 'Shop'}</span>
            </div>
          </div>
        </header>

        {error && !loading && <p className="error-message general">{error}</p>}

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon orders-icon">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <div className="stat-details">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon plants-icon">
              <i className="fas fa-leaf"></i>
            </div>
            <div className="stat-details">
              <h3>{shopData?.plants?.length || 0}</h3>
              <p>Plants Listed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-details">
              <h3>₹{orders.reduce((total, order) => total + (order.totalAmount || 0), 0).toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rating-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-details">
              <h3>{shopData?.rating || '4.5'}</h3>
              <p>Shop Rating</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <section className="shop-info-section">
            <div className="section-header">
              <h2>Shop Information</h2>
              {!editMode ? (
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
              ) : (
                <button className="cancel-btn" onClick={() => {
                  setEditMode(false);
                  setShopFormData({
                    shopName: shopData?.shopName || '',
                    phone: shopData?.phone || '',
                    address: shopData?.address || '',
                    description: shopData?.description || ''
                  });
                  setUpdateProfileError(null);
                }}>
                  <i className="fas fa-times"></i> Cancel
                </button>
              )}
            </div>

            {!editMode ? (
              <div className="info-card">
                <div className="info-row">
                  <div className="info-item">
                    <span className="info-label">Shop Name</span>
                    <span className="info-value">{shopData?.shopName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{shopData?.email}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{shopData?.phone || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address</span>
                    <span className="info-value">{shopData?.address || 'Not provided'}</span>
                  </div>
                </div>
                <div className="info-row full-width">
                  <div className="info-item">
                    <span className="info-label">Description</span>
                    <span className="info-value description">{shopData?.description || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="edit-profile-form">
                {updateProfileError && <p className="error-message">{updateProfileError}</p>}
                <div className="form-group">
                  <label htmlFor="shopName">Shop Name</label>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={shopFormData.shopName}
                    onChange={handleShopInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={shopFormData.phone}
                    onChange={handleShopInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shopFormData.address}
                    onChange={handleShopInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={shopFormData.description}
                    onChange={handleShopInputChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="save-btn" disabled={updatingProfile}>
                  {updatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}
          </section>

          <section className="recent-orders-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <Link to="/shop-dashboard/orders" className="view-all-btn">View All <i className="fas fa-arrow-right"></i></Link>
            </div>
            {loading && !orders.length && <p className="loading-message"><i className="fas fa-spinner fa-spin"></i> Loading orders...</p>}
            {!loading && orders.length === 0 &&
              <div className="empty-state">
                <i className="fas fa-shopping-cart empty-icon"></i>
                <p>No recent orders found</p>
                <span>New orders will appear here</span>
              </div>
            }
            {orders.length > 0 && (
              <div className="orders-list-container">
                <div className="search-filter">
                  <input type="text" placeholder="Search orders..." />
                  <button className="filter-btn">Filter</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order._id}>
                        <td>{order._id.substring(0, 8)}</td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>
                          <ul>
                            {order.items.map((item, itemIndex) => (
                              <li key={itemIndex}>{item.plant?.name || 'Plant'} x {item.quantity}</li>
                            ))}
                          </ul>
                        </td>
                        <td>₹{order.shopTotalAmount ? order.shopTotalAmount.toFixed(2) : (order.totalAmount ? order.totalAmount.toFixed(2) : '0.00')}</td>
                        <td><span className={`status ${order.status?.toLowerCase().replace(/ /g, '-') || 'pending'}`}>{order.status || 'Pending'}</span></td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>
                          <button className="action-btn view-btn">View</button>
                          {(order.status === 'Pending' || !order.status) && (
                            <button className="action-btn update-status-btn">Mark as Shipped</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="my-plants-section">
            <div className="section-header">
              <h2>My Plants</h2>
              <Link to="/shop-dashboard/my-plants" className="view-all-btn">View All <i className="fas fa-arrow-right"></i></Link>
            </div>
            {loading && !plants.length && <p className="loading-message"><i className="fas fa-spinner fa-spin"></i> Loading plants...</p>}
            {!loading && plants.length === 0 &&
              <div className="empty-state">
                <i className="fas fa-leaf empty-icon"></i>
                <p>No plants added yet</p>
                <span>Add plants to your shop to see them here</span>
              </div>
            }
            {plants.length > 0 && (
              <div className="plants-grid">
                {plants.slice(0, 4).map(plant => (
                  <div className="plant-card" key={plant._id}>
                    <div className="plant-image">
                      <img src={`http://localhost:5000${plant.imageUrl}`} alt={plant.name} />
                      <span className={`plant-status ${plant.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {plant.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="plant-details">
                      <h3>{plant.name}</h3>
                      <p className="plant-category">{plant.category}</p>
                      <p className="plant-price">₹{plant.price.toFixed(2)}</p>
                      <div className="plant-actions">
                        <button className="edit-plant-btn" onClick={() => navigate(`/shop-dashboard/edit-plant/${plant._id}`)}>
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="toggle-featured-btn" onClick={async () => {
                          try {
                            await plantAPI.toggleFeatured(plant._id);
                            fetchData();
                          } catch (error) {
                            console.error('Error toggling featured status:', error);
                          }
                        }}>
                          <i className={`fas ${plant.isFeatured ? 'fa-star' : 'fa-star-o'}`}></i>
                          {plant.isFeatured ? 'Featured' : 'Feature'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="add-plant-section">
            <h2>Add New Plant</h2>
            {addPlantError && !addingPlant && <p className="error-message">{addPlantError}</p>}
            <form onSubmit={handleAddPlantSubmit} className="add-plant-form">
              <div className="form-group">
                <label htmlFor="plantName">Plant Name</label>
                <input
                  type="text"
                  id="plantName"
                  name="name"
                  placeholder="Enter plant name"
                  value={plantFormData.name}
                  onChange={handlePlantInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="plantCategory">Category</label>
                <select
                  id="plantCategory"
                  name="category"
                  value={plantFormData.category}
                  onChange={handlePlantInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="plantDescription">Description</label>
                <textarea
                  id="plantDescription"
                  name="description"
                  placeholder="Enter plant description"
                  value={plantFormData.description}
                  onChange={handlePlantInputChange}
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="plantPrice">Price</label>
                <input
                  type="number"
                  id="plantPrice"
                  name="price"
                  placeholder="Enter price"
                  value={plantFormData.price}
                  onChange={handlePlantInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Availability</label>
                <div className="availability-options">
                  <label className="availability-option">
                    <input
                      type="radio"
                      name="inStock"
                      value="true"
                      checked={plantFormData.inStock === true}
                      onChange={() => setPlantFormData(prev => ({ ...prev, inStock: true }))}
                    />
                    In Stock
                  </label>
                  <label className="availability-option">
                    <input
                      type="radio"
                      name="inStock"
                      value="false"
                      checked={plantFormData.inStock === false}
                      onChange={() => setPlantFormData(prev => ({ ...prev, inStock: false }))}
                    />
                    Out of Stock
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="plantImage">Plant Image</label>
                <input
                  type="file"
                  id="plantImage"
                  name="image"
                  onChange={handlePlantInputChange}
                  accept="image/*"
                />
              </div>
              <div className="form-group">
                <label htmlFor="plantModel3d">3D Model (Optional)</label>
                <input
                  type="file"
                  id="plantModel3d"
                  name="model3d"
                  onChange={handlePlantInputChange}
                />
              </div>

              <button type="submit" className="add-plant-btn" disabled={addingPlant}>
                {addingPlant ? 'Adding...' : 'Add Plant'}
              </button>
            </form>
          </section>

          <section className="quick-actions-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions-container">
              <div className="action-card">
                <div className="action-icon">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <h3>Add Plant</h3>
                <p>List a new plant in your shop</p>
                <Link to="/shop-dashboard/add-plant" className="action-btn">Add Now</Link>
              </div>

              <div className="action-card">
                <div className="action-icon">
                  <i className="fas fa-tags"></i>
                </div>
                <h3>Manage Inventory</h3>
                <p>Update stock and prices</p>
                <Link to="/shop-dashboard/my-plants" className="action-btn">Manage</Link>
              </div>

              <div className="action-card">
                <div className="action-icon">
                  <i className="fas fa-cog"></i>
                </div>
                <h3>Shop Settings</h3>
                <p>Update your shop details</p>
                <Link to="/shop-dashboard/profile" className="action-btn">Settings</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboard;
