const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Plant = require('../models/Plant');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateUser, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate({
                path: 'items.plant',
                select: 'name price image inStock stockQuantity',
                populate: {
                    path: 'shop',
                    select: 'shopName'
                }
            });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [],
                totalAmount: 0
            });
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add item to cart
router.post('/add', authenticateUser, [
    body('plantId').notEmpty().withMessage('Plant ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { plantId, quantity } = req.body;

        // Check if plant exists and is in stock
        const plant = await Plant.findById(plantId);
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        if (!plant.inStock || plant.stockQuantity < quantity) {
            return res.status(400).json({ message: 'Plant is out of stock or insufficient quantity' });
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [],
                totalAmount: 0
            });
        }

        // Check if plant already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.plant.toString() === plantId
        );

        if (existingItemIndex > -1) {
            // Update quantity if plant already in cart
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (plant.stockQuantity < newQuantity) {
                return res.status(400).json({ message: 'Insufficient stock for requested quantity' });
            }
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart
            cart.items.push({
                plant: plantId,
                quantity: quantity,
                price: plant.price
            });
        }

        await cart.save();

        // Populate cart with plant details
        const populatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.plant',
                select: 'name price image inStock stockQuantity',
                populate: {
                    path: 'shop',
                    select: 'shopName'
                }
            });

        res.json({
            message: 'Item added to cart successfully',
            cart: populatedCart
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update cart item quantity
router.put('/update/:itemId', authenticateUser, [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { quantity } = req.body;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Check stock availability
        const plant = await Plant.findById(cart.items[itemIndex].plant);
        if (!plant || plant.stockQuantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock for requested quantity' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.plant',
                select: 'name price image inStock stockQuantity',
                populate: {
                    path: 'shop',
                    select: 'shopName'
                }
            });

        res.json({
            message: 'Cart item updated successfully',
            cart: populatedCart
        });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove item from cart
router.delete('/remove/:itemId', authenticateUser, async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.plant',
                select: 'name price image inStock stockQuantity',
                populate: {
                    path: 'shop',
                    select: 'shopName'
                }
            });

        res.json({
            message: 'Item removed from cart successfully',
            cart: populatedCart
        });
    } catch (error) {
        console.error('Remove cart item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Clear cart
router.delete('/clear', authenticateUser, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.json({
            message: 'Cart cleared successfully',
            cart: {
                items: [],
                totalAmount: 0
            }
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 