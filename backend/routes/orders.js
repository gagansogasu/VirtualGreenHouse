const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Plant = require('../models/Plant');
const { authenticateUser, authenticateShop } = require('../middleware/auth');

const router = express.Router();

// Get all orders for the authenticated user
router.get('/', authenticateUser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.plant', 'name price image')
            .populate('shop', 'shopName address');
        res.json(orders);
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders for the authenticated shop
router.get('/shop', authenticateShop, async (req, res) => {
    try {
        const orders = await Order.find({ shop: req.shop._id })
            .populate('items.plant', 'name price image')
            .populate('user', 'name email address');
        res.json(orders);
    } catch (error) {
        console.error('Get shop orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single order by ID (user or shop)
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('items.plant', 'name price image')
            .populate('user', 'name email address')
            .populate('shop', 'shopName address');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Get order by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new order (user checkout)
router.post('/', authenticateUser, [
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id })
            .populate({
                path: 'items.plant',
                select: 'name price image inStock stockQuantity',
                populate: {
                    path: 'shop',
                    select: 'shopName'
                }
            });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // Debug logging
        console.log('Cart:', JSON.stringify(cart, null, 2));

        if (!cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
            console.error('No items in cart');
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // Check if all items have plants and shops
        for (const [index, item] of cart.items.entries()) {
            if (!item.plant) {
                console.error(`Item at index ${index} has no plant:`, item);
                return res.status(400).json({
                    message: 'A plant in your cart could not be found. Please remove it and try again.'
                });
            }

            // Log detailed information about the plant and shop
            console.log(`Item ${index} plant:`, item.plant);
            console.log(`Item ${index} plant shop:`, item.plant.shop);

            if (!item.plant.shop) {
                console.error(`Plant ${item.plant._id} has no shop information:`, item.plant);
                return res.status(400).json({
                    message: 'A plant in your cart is missing shop information. Please remove it and try again.'
                });
            }
        }

        // Get shop ID from the first item
        // Handle both populated and non-populated shop references
        const firstItem = cart.items[0];
        let shopId;

        if (firstItem.plant.shop && typeof firstItem.plant.shop === 'object' && firstItem.plant.shop._id) {
            // Shop is populated (object with _id)
            shopId = firstItem.plant.shop._id;
        } else if (firstItem.plant.shop && typeof firstItem.plant.shop === 'string') {
            // Shop is a string (ObjectId)
            shopId = firstItem.plant.shop;
        } else {
            // Try to get shop from plant directly
            const plant = await Plant.findById(firstItem.plant._id || firstItem.plant);
            if (!plant || !plant.shop) {
                console.error('Could not find shop for plant:', firstItem.plant);
                return res.status(400).json({
                    message: 'Could not determine shop for order. Please try again.'
                });
            }
            shopId = plant.shop;
        }

        console.log('Extracted shop ID:', shopId);

        // Check stock for each item
        for (const item of cart.items) {
            if (!item.plant) {
                console.error('Cart item missing plant:', item);
                return res.status(400).json({ message: 'A plant in your cart could not be found. Please remove it and try again.' });
            }
            if (!item.plant.inStock || item.plant.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.plant.name}` });
            }
        }

        // Deduct stock
        for (const item of cart.items) {
            // Find the plant in the database to update its stock
            const plant = await Plant.findById(item.plant._id || item.plant);
            if (plant) {
                plant.stockQuantity -= item.quantity;
                if (plant.stockQuantity <= 0) {
                    plant.inStock = false;
                }
                await plant.save();
            }
        }

        // Create order
        const orderData = {
            user: req.user._id,
            shop: shopId,
            items: cart.items.map(item => ({
                plant: item.plant._id || item.plant,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cart.totalAmount,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            status: 'Pending'
        };

        console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

        const order = new Order(orderData);
        await order.save();

        // Clear cart
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json({
            message: 'Order placed successfully',
            _id: order._id,
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        console.error('Error stack:', error.stack);
        console.error('Error message:', error.message);

        // Check for specific MongoDB errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid data format',
                error: error.message
            });
        }

        res.status(500).json({
            message: 'Server error',
            error: error.message,
            details: error.stack
        });
    }
});

// Cancel an order (user or shop)
router.put('/cancel/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }
        order.status = 'Cancelled';
        await order.save();
        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 