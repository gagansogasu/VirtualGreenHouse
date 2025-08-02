const express = require('express');
const { body, validationResult } = require('express-validator');
const Shop = require('../models/Shop');
const { authenticateShop, generateShopToken } = require('../middleware/auth');

const router = express.Router();

// Register shop
router.post('/register', [
    body('shopName').trim().notEmpty().withMessage('Shop name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                fields: errors.array().reduce((acc, err) => {
                    acc[err.path] = err.msg;
                    return acc;
                }, {})
            });
        }

        const { shopName, email, password, phone, address, description } = req.body;

        // Check if shop already exists
        const existingShop = await Shop.findOne({ email });
        if (existingShop) {
            return res.status(400).json({ message: 'Shop with this email already exists' });
        }

        // Create new shop
        const shop = new Shop({
            shopName,
            email,
            password,
            phone,
            address,
            description
        });

        await shop.save();

        // Generate token
        const token = generateShopToken(shop._id);

        res.status(201).json({
            message: 'Shop registered successfully',
            token,
            shop: {
                id: shop._id,
                shopName: shop.shopName,
                email: shop.email,
                phone: shop.phone,
                address: shop.address,
                description: shop.description
            }
        });
    } catch (error) {
        console.error('Shop registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login shop
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { email, password } = req.body;

        // Find shop
        const shop = await Shop.findOne({ email });
        if (!shop) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await shop.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateShopToken(shop._id);

        res.json({
            message: 'Login successful',
            token,
            shop: {
                id: shop._id,
                shopName: shop.shopName,
                email: shop.email,
                phone: shop.phone,
                address: shop.address,
                description: shop.description
            }
        });
    } catch (error) {
        console.error('Shop login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get shop profile
router.get('/profile', authenticateShop, async (req, res) => {
    try {
        res.json(req.shop);
    } catch (error) {
        console.error('Get shop profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update shop profile
router.put('/profile', authenticateShop, [
    body('shopName').optional().trim().notEmpty().withMessage('Shop name cannot be empty'),
    body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { shopName, phone, address, description } = req.body;
        const updates = {};

        if (shopName) updates.shopName = shopName;
        if (phone) updates.phone = phone;
        if (address) updates.address = address;
        if (description) updates.description = description;

        const shop = await Shop.findByIdAndUpdate(
            req.shop._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            message: 'Profile updated successfully',
            shop
        });
    } catch (error) {
        console.error('Update shop profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get shop by ID (public endpoint)
router.get('/:shopId', async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.shopId).select('-password');
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.json(shop);
    } catch (error) {
        console.error('Get shop by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all shops (public)
router.get('/', async (req, res) => {
    try {
        const shops = await Shop.find().select('-password');
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 