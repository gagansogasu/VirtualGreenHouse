import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // Always attach token if present
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear all relevant storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Shop API calls
export const shopAPI = {
    login: (credentials) => api.post('/shops/login', credentials),
    register: (shopData) => api.post('/shops/register', shopData),
    getProfile: () => api.get('/shops/profile'),
    updateProfile: (data) => api.put('/shops/profile', data),
    getShopById: (shopId) => api.get(`/shops/${shopId}`),
    getAllShops: () => api.get('/shops'),
};

// User API calls
export const userAPI = {
    login: (credentials) => api.post('/users/login', credentials),
    register: (userData) => api.post('/users/register', userData),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
};

// Cart API calls
export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (plantId, quantity) => api.post('/cart/add', { plantId, quantity }),
    updateCartItem: (itemId, quantity) => api.put(`/cart/update/${itemId}`, { quantity }),
    removeCartItem: (itemId) => api.delete(`/cart/remove/${itemId}`),
    clearCart: () => api.delete('/cart/clear'),
};

// Order API calls
export const orderAPI = {
    getOrders: () => api.get('/orders'),
    getShopOrders: () => api.get('/orders/shop'),
    getOrder: (orderId) => api.get(`/orders/${orderId}`),
    createOrder: (orderData) => api.post('/orders', orderData),
    cancelOrder: (orderId) => api.put(`/orders/cancel/${orderId}`),
};

// Plant API calls
export const plantAPI = {
    getPlants: () => api.get('/plants/shop'),
    getPlant: (plantId) => api.get(`/plants/${plantId}`),
    addPlant: (plantData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        return api.post('/plants', plantData, config);
    },
    updatePlant: (plantId, plantData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        return api.put(`/plants/${plantId}`, plantData, config);
    },
    deletePlant: (plantId) => api.delete(`/plants/${plantId}`),
    toggleFeatured: (plantId) => api.put(`/plants/${plantId}/toggle-featured`),
    getPlantsByShop: (shopId) => api.get(`/plants/by-shop/${shopId}`),
};

export default api;