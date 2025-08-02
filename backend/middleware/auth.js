const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Shop = require('../models/Shop');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

// Middleware to authenticate shop
const authenticateShop = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const shop = await Shop.findById(decoded.shopId).select('-password');

        if (!shop) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.shop = shop;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

// Generate JWT token for user
const generateUserToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Generate JWT token for shop
const generateShopToken = (shopId) => {
    return jwt.sign({ shopId }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = {
    authenticateUser,
    authenticateShop,
    generateUserToken,
    generateShopToken
}; 